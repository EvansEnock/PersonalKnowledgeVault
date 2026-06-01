from app.core.config import OPENAI_API_KEY
from app.core.logger import logger


def summarize(text: str) -> str:
    """
    Summarise the given text using OpenAI's chat API.
    Falls back to a truncated excerpt if the API key is missing or the call fails.
    """
    if not OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set — returning excerpt instead of summary")
        return _excerpt_fallback(text)

    try:
        from openai import OpenAI

        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a concise summariser. "
                        "Summarise the user's note in 2-3 sentences, preserving key facts."
                    ),
                },
                {"role": "user", "content": text},
            ],
            max_tokens=200,
            temperature=0.3,
        )
        summary = response.choices[0].message.content.strip()
        logger.info("AI summary generated successfully")
        return summary

    except Exception as exc:
        logger.error(f"AI summarisation failed: {exc}")
        return _excerpt_fallback(text)


def _excerpt_fallback(text: str, max_chars: int = 200) -> str:
    """Return the first `max_chars` characters as a plain excerpt."""
    excerpt = text[:max_chars].strip()
    return excerpt + ("…" if len(text) > max_chars else "")
