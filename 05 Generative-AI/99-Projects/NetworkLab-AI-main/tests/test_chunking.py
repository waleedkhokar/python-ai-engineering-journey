import pytest
from src.chunking import split_text


def test_split_text_creates_overlapping_chunks():
    chunks = split_text("network " * 300, chunk_size=100, overlap=20)
    assert len(chunks) > 1
    assert all(chunks)


def test_invalid_overlap_is_rejected():
    with pytest.raises(ValueError):
        split_text("hello", chunk_size=10, overlap=10)
