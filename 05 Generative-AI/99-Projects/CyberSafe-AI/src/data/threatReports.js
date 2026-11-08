const threatReports = [
  {
    id: 1,
    title: "Microsoft 365 Phishing Campaign",
    severity: "Critical",
    target: "Business Users",
    description:
      "Attackers are sending fake Microsoft login emails to steal credentials.",
    prevention: [
      "Enable MFA",
      "Verify sender addresses",
      "Never log in through email links"
    ]
  },

  {
    id: 2,
    title: "Fake PayPal Login",
    severity: "High",
    target: "Online Shoppers",
    description:
      "Fake PayPal emails redirect users to phishing websites.",
    prevention: [
      "Visit paypal.com directly",
      "Don't click email links",
      "Check URLs carefully"
    ]
  }
];

export default threatReports;