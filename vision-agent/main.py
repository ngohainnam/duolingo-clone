import json
import os
from pathlib import Path

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.agents.events import (
    AgentTurnEndedEvent,
    AgentTurnStartedEvent,
    UserTurnEndedEvent,
    UserTurnStartedEvent,
)
from vision_agents.core.instructions import Instructions
from vision_agents.core.utils.audio_filter import FirstSpeakerWinsFilter
from vision_agents.plugins import gemini, getstream


SERVICE_DIR = Path(__file__).resolve().parent
ROOT_ENV = SERVICE_DIR.parent / ".env"
BASE_TEACHER_INSTRUCTIONS = (SERVICE_DIR / "teacher.md").read_text(encoding="utf-8")

load_dotenv(ROOT_ENV)


def require_environment() -> None:
    missing = [
        name
        for name in ("STREAM_API_KEY", "STREAM_API_SECRET", "GEMINI_API_KEY")
        if not os.getenv(name)
    ]

    if missing:
        names = ", ".join(missing)
        raise RuntimeError(f"Missing required environment variables: {names}")


async def create_agent(**_: object) -> Agent:
    require_environment()

    agent = Agent(
        edge=getstream.Edge(),
        llm=gemini.Realtime(api_key=os.environ["GEMINI_API_KEY"]),
        agent_user=User(
            id="ai-language-teacher",
            name="AI Language Teacher",
        ),
        instructions=BASE_TEACHER_INSTRUCTIONS,
        multi_speaker_filter=FirstSpeakerWinsFilter(
            model_dir=str(SERVICE_DIR / ".cache" / "first-speaker-wins"),
        ),
    )

    async def send_state(status: str) -> None:
        await agent.edge.send_custom_event(
            {
                "type": "lesson.agent_state",
                "status": status,
            }
        )

    async def send_latest_transcript(role: str, speaker: str) -> None:
        if not agent.conversation:
            return

        message = next(
            (
                item
                for item in reversed(agent.conversation.messages)
                if item.role == role and item.content.strip()
            ),
            None,
        )
        if not message:
            return

        await agent.edge.send_custom_event(
            {
                "type": "lesson.transcript",
                "speaker": speaker,
                "text": message.content.strip()[:2000],
            }
        )

    @agent.subscribe
    async def on_user_turn_started(_: UserTurnStartedEvent) -> None:
        await send_state("listening")

    @agent.subscribe
    async def on_user_turn_ended(_: UserTurnEndedEvent) -> None:
        await send_latest_transcript("user", "learner")
        await send_state("thinking")

    @agent.subscribe
    async def on_agent_turn_started(_: AgentTurnStartedEvent) -> None:
        await send_state("speaking")

    @agent.subscribe
    async def on_agent_turn_ended(_: AgentTurnEndedEvent) -> None:
        await send_latest_transcript("assistant", "teacher")
        await send_state("listening")

    return agent


def lesson_instructions(custom_data: dict[str, object]) -> str:
    lesson_context = {
        "language": custom_data.get("language"),
        "lesson": custom_data.get("lesson"),
        "goals": custom_data.get("goals"),
        "vocabulary": custom_data.get("vocabulary"),
        "phrases": custom_data.get("phrases"),
        "aiTeacherPrompt": custom_data.get("aiTeacherPrompt"),
    }

    return (
        f"{BASE_TEACHER_INSTRUCTIONS}\n\n"
        "## Selected lesson context\n"
        "Use this Stream call data as the source of truth for the lesson. "
        "Follow the AI teacher prompt, cover the goals, and practice the provided "
        "vocabulary and phrases. Do not invent a different lesson.\n\n"
        f"{json.dumps(lesson_context, ensure_ascii=False, indent=2)}"
    )


async def join_call(
    agent: Agent,
    call_type: str,
    call_id: str,
    **_: object,
) -> None:
    call = await agent.create_call(call_type, call_id)
    response = await call.get()
    custom_data = response.data.call.custom
    agent.instructions = Instructions(lesson_instructions(custom_data))

    teacher_prompt = custom_data.get("aiTeacherPrompt")
    opening_message = (
        teacher_prompt.get("openingMessage")
        if isinstance(teacher_prompt, dict)
        else None
    )

    async with agent.join(call):
        await agent.simple_response(
            "Begin the selected lesson now. "
            f"Use this opening message naturally: {opening_message}"
        )
        await agent.finish()


launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    agent_idle_timeout=60,
    max_concurrent_sessions=10,
    max_sessions_per_call=1,
    max_session_duration_seconds=30 * 60,
)

runner = Runner(launcher=launcher)


if __name__ == "__main__":
    runner.cli()
