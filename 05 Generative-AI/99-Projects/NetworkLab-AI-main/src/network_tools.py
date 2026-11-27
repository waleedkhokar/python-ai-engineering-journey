from __future__ import annotations

import ipaddress

COMMON_PORTS = {
    20: "FTP data — TCP", 21: "FTP control — TCP", 22: "SSH — TCP",
    23: "Telnet — TCP", 25: "SMTP — TCP", 53: "DNS — TCP/UDP",
    67: "DHCP server — UDP", 68: "DHCP client — UDP", 80: "HTTP — TCP",
    110: "POP3 — TCP", 123: "NTP — UDP", 143: "IMAP — TCP",
    161: "SNMP — UDP", 443: "HTTPS — TCP", 445: "SMB — TCP",
    3306: "MySQL — TCP", 3389: "RDP — TCP", 5432: "PostgreSQL — TCP",
    8080: "Alternative HTTP — commonly TCP",
}


def calculate_subnet(address: str, prefix: int) -> dict:
    try:
        network = ipaddress.ip_network(f"{address}/{prefix}", strict=False)
    except ValueError as exc:
        raise ValueError(f"Invalid IPv4 address or CIDR prefix: {exc}") from exc
    if not isinstance(network, ipaddress.IPv4Network):
        raise ValueError("Please enter an IPv4 address.")
    usable_count = max(network.num_addresses - 2, 0)
    return {
        "Network address": str(network.network_address),
        "Broadcast address": str(network.broadcast_address),
        "Subnet mask": str(network.netmask),
        "Wildcard mask": str(network.hostmask),
        "CIDR prefix": f"/{network.prefixlen}",
        "Total addresses": network.num_addresses,
        "Usable host addresses": usable_count,
        "First usable host": str(network[1]) if network.num_addresses > 2 else "N/A",
        "Last usable host": str(network[-2]) if network.num_addresses > 2 else "N/A",
    }


def validate_ipv4(address: str) -> tuple[bool, str]:
    try:
        ipaddress.IPv4Address(address)
        return True, f"{address} is a valid IPv4 address."
    except ipaddress.AddressValueError:
        return False, f"{address} is not a valid IPv4 address."


def get_common_port(port: int) -> str:
    if not 0 <= port <= 65535:
        return "Port must be between 0 and 65535."
    return COMMON_PORTS.get(port, f"Port {port} is not included in the common-port reference table.")


def explain_cisco_config(config: str) -> list[str]:
    exact = {
        "enable": "Enters privileged EXEC mode.",
        "configure terminal": "Enters global configuration mode.",
        "conf t": "Short form of configure terminal.",
        "no shutdown": "Enables the interface administratively.",
        "shutdown": "Administratively disables the interface.",
        "end": "Returns to privileged EXEC mode.",
        "exit": "Leaves the current configuration mode.",
        "show ip interface brief": "Displays interface IP addresses and status.",
        "show running-config": "Displays the active configuration.",
        "show vlan brief": "Displays VLANs and their access-port assignments.",
        "show ip route": "Displays the IP routing table.",
        "switchport mode access": "Configures the switch port as an access port.",
        "switchport mode trunk": "Configures the switch port as a trunk port.",
    }
    explanations = []
    for raw in config.splitlines():
        line = raw.strip()
        if not line or line.startswith("!"):
            continue
        normalized = " ".join(line.lower().split())
        if normalized in exact:
            description = exact[normalized]
        elif normalized.startswith("interface "):
            description = "Selects an interface for configuration."
        elif normalized.startswith("ip address "):
            description = "Assigns an IPv4 address and subnet mask to an interface."
        elif normalized.startswith("vlan "):
            description = "Creates or selects a VLAN in VLAN configuration mode."
        elif normalized.startswith("encapsulation dot1q "):
            description = "Configures IEEE 802.1Q VLAN tagging on a subinterface."
        elif normalized.startswith("ip helper-address "):
            description = "Forwards selected UDP broadcasts, commonly DHCP requests, to a server."
        elif normalized == "ip nat inside":
            description = "Marks the interface as the NAT inside interface."
        elif normalized == "ip nat outside":
            description = "Marks the interface as the NAT outside interface."
        else:
            description = "No built-in explanation is available; verify this command in Cisco IOS documentation."
        explanations.append(f"`{line}` — {description}")
    return explanations
