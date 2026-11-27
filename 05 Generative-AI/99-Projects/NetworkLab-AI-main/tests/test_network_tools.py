from src.network_tools import calculate_subnet, validate_ipv4, get_common_port


def test_subnet_calculation():
    result = calculate_subnet("192.168.1.10", 24)
    assert result["Network address"] == "192.168.1.0"
    assert result["Broadcast address"] == "192.168.1.255"
    assert result["Usable host addresses"] == 254


def test_ipv4_validation():
    assert validate_ipv4("192.168.1.1")[0]
    assert not validate_ipv4("300.1.1.1")[0]


def test_common_port_lookup():
    assert "HTTPS" in get_common_port(443)
