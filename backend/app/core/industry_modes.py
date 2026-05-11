INDUSTRY_RUBRICS = {
    "Software Engineering": {
        "focus": ["Code efficiency", "System Design", "Edge case handling"],
        "rubric": "Evaluate based on Big O notation knowledge, modularity, and technical accuracy."
    },
    "Product Management": {
        "focus": ["User-centricity", "Prioritization frameworks", "Data-driven decisions"],
        "rubric": "Evaluate based on Product Sense, Strategy, and the ability to define success metrics."
    },
    "Consulting": {
        "focus": ["MECE framework", "Structured communication", "Quantitative synthesis"],
        "rubric": "Evaluate based on case-cracking ability and top-down communication style."
    },
    "Finance": {
        "focus": ["Valuation methods", "Market awareness", "Attention to detail"],
        "rubric": "Evaluate based on technical financial knowledge and ethical judgment."
    }
}

def get_rubric_for_role(role: str) -> str:
    for key, data in INDUSTRY_RUBRICS.items():
        if key.lower() in role.lower():
            return data["rubric"]
    return "Evaluate based on general professional communication and logical reasoning."