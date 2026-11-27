from src.rag_pipeline import RAGPipeline


def test_page_metadata_is_preserved():
    pipeline = RAGPipeline()
    count = pipeline.add_document(
        "networking.txt",
        [{"page": 3, "text": "DHCP uses Discover Offer Request Acknowledge."}],
    )
    assert count >= 1
    results = pipeline.search("DHCP Discover Offer")
    assert results
    assert results[0]["source"] == "networking.txt"
    assert results[0]["page"] == 3
