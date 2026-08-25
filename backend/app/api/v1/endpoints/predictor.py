import math
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.schemas.predictor import PredictorRequest, PredictorResponse, CollegePrediction, ChoiceFillingItem

router = APIRouter()

# Comprehensive database of premier Indian Engineering Institutes with realistic JoSAA / CSAB Cutoff data
COLLEGE_DATABASE: List[Dict[str, Any]] = [
    # --- IITs (JEE Advanced / High JEE Main) ---
    {
        "id": "iit-b-cse",
        "institute_name": "Indian Institute of Technology, Bombay (IIT Bombay)",
        "short_name": "IIT Bombay",
        "type": "IIT",
        "location": "Mumbai, Maharashtra",
        "state": "Maharashtra",
        "branch": "Computer Science & Engineering",
        "opening_rank": 1,
        "closing_rank": 68,
        "avg_package_lpa": 23.5,
        "annual_fee_lakhs": 2.2,
        "nirf_rank": 3,
    },
    {
        "id": "iit-b-ece",
        "institute_name": "Indian Institute of Technology, Bombay (IIT Bombay)",
        "short_name": "IIT Bombay",
        "type": "IIT",
        "location": "Mumbai, Maharashtra",
        "state": "Maharashtra",
        "branch": "Electrical Engineering (ECE/EEE)",
        "opening_rank": 80,
        "closing_rank": 380,
        "avg_package_lpa": 21.0,
        "annual_fee_lakhs": 2.2,
        "nirf_rank": 3,
    },
    {
        "id": "iit-d-cse",
        "institute_name": "Indian Institute of Technology, Delhi (IIT Delhi)",
        "short_name": "IIT Delhi",
        "type": "IIT",
        "location": "New Delhi, Delhi",
        "state": "Delhi",
        "branch": "Computer Science & Engineering",
        "opening_rank": 25,
        "closing_rank": 118,
        "avg_package_lpa": 22.8,
        "annual_fee_lakhs": 2.25,
        "nirf_rank": 2,
    },
    {
        "id": "iit-m-cse",
        "institute_name": "Indian Institute of Technology, Madras (IIT Madras)",
        "short_name": "IIT Madras",
        "type": "IIT",
        "location": "Chennai, Tamil Nadu",
        "state": "Tamil Nadu",
        "branch": "Computer Science & Engineering",
        "opening_rank": 40,
        "closing_rank": 148,
        "avg_package_lpa": 21.5,
        "annual_fee_lakhs": 2.15,
        "nirf_rank": 1,
    },
    {
        "id": "iit-kgp-cse",
        "institute_name": "Indian Institute of Technology, Kharagpur (IIT KGP)",
        "short_name": "IIT Kharagpur",
        "type": "IIT",
        "location": "Kharagpur, West Bengal",
        "state": "West Bengal",
        "branch": "Computer Science & Engineering",
        "opening_rank": 120,
        "closing_rank": 415,
        "avg_package_lpa": 20.2,
        "annual_fee_lakhs": 2.1,
        "nirf_rank": 6,
    },
    {
        "id": "iit-r-cse",
        "institute_name": "Indian Institute of Technology, Roorkee (IIT Roorkee)",
        "short_name": "IIT Roorkee",
        "type": "IIT",
        "location": "Roorkee, Uttarakhand",
        "state": "Uttarakhand",
        "branch": "Computer Science & Engineering",
        "opening_rank": 250,
        "closing_rank": 412,
        "avg_package_lpa": 19.5,
        "annual_fee_lakhs": 2.2,
        "nirf_rank": 5,
    },
    {
        "id": "iit-hyd-ai",
        "institute_name": "Indian Institute of Technology, Hyderabad (IIT Hyderabad)",
        "short_name": "IIT Hyderabad",
        "type": "IIT",
        "location": "Sangareddy, Telangana",
        "state": "Telangana",
        "branch": "Artificial Intelligence & Data Science",
        "opening_rank": 350,
        "closing_rank": 670,
        "avg_package_lpa": 20.0,
        "annual_fee_lakhs": 2.3,
        "nirf_rank": 8,
    },

    # --- NITs (JEE Main) ---
    {
        "id": "nit-trichy-cse",
        "institute_name": "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
        "short_name": "NIT Trichy",
        "type": "NIT",
        "location": "Tiruchirappalli, Tamil Nadu",
        "state": "Tamil Nadu",
        "branch": "Computer Science & Engineering",
        "opening_rank": 1100,
        "closing_rank": 4600,
        "avg_package_lpa": 27.2,
        "annual_fee_lakhs": 1.75,
        "nirf_rank": 9,
    },
    {
        "id": "nit-trichy-ece",
        "institute_name": "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
        "short_name": "NIT Trichy",
        "type": "NIT",
        "location": "Tiruchirappalli, Tamil Nadu",
        "state": "Tamil Nadu",
        "branch": "Electronics & Communication Engineering",
        "opening_rank": 3500,
        "closing_rank": 8900,
        "avg_package_lpa": 19.8,
        "annual_fee_lakhs": 1.75,
        "nirf_rank": 9,
    },
    {
        "id": "nit-surathkal-cse",
        "institute_name": "National Institute of Technology Karnataka, Surathkal",
        "short_name": "NIT Surathkal",
        "type": "NIT",
        "location": "Surathkal, Karnataka",
        "state": "Karnataka",
        "branch": "Computer Science & Engineering",
        "opening_rank": 1400,
        "closing_rank": 5400,
        "avg_package_lpa": 24.1,
        "annual_fee_lakhs": 1.65,
        "nirf_rank": 12,
    },
    {
        "id": "nit-warangal-cse",
        "institute_name": "National Institute of Technology, Warangal",
        "short_name": "NIT Warangal",
        "type": "NIT",
        "location": "Warangal, Telangana",
        "state": "Telangana",
        "branch": "Computer Science & Engineering",
        "opening_rank": 1500,
        "closing_rank": 3100,
        "avg_package_lpa": 25.5,
        "annual_fee_lakhs": 1.7,
        "nirf_rank": 21,
    },
    {
        "id": "nit-warangal-ece",
        "institute_name": "National Institute of Technology, Warangal",
        "short_name": "NIT Warangal",
        "type": "NIT",
        "location": "Warangal, Telangana",
        "state": "Telangana",
        "branch": "Electronics & Communication Engineering",
        "opening_rank": 4200,
        "closing_rank": 9500,
        "avg_package_lpa": 18.2,
        "annual_fee_lakhs": 1.7,
        "nirf_rank": 21,
    },
    {
        "id": "nit-rourkela-cse",
        "institute_name": "National Institute of Technology, Rourkela",
        "short_name": "NIT Rourkela",
        "type": "NIT",
        "location": "Rourkela, Odisha",
        "state": "Odisha",
        "branch": "Computer Science & Engineering",
        "opening_rank": 2800,
        "closing_rank": 8200,
        "avg_package_lpa": 21.8,
        "annual_fee_lakhs": 1.6,
        "nirf_rank": 16,
    },
    {
        "id": "mnit-jaipur-cse",
        "institute_name": "Malaviya National Institute of Technology, Jaipur",
        "short_name": "MNIT Jaipur",
        "type": "NIT",
        "location": "Jaipur, Rajasthan",
        "state": "Rajasthan",
        "branch": "Computer Science & Engineering",
        "opening_rank": 3200,
        "closing_rank": 9800,
        "avg_package_lpa": 20.5,
        "annual_fee_lakhs": 1.65,
        "nirf_rank": 37,
    },
    {
        "id": "vnit-nagpur-cse",
        "institute_name": "Visvesvaraya National Institute of Technology, Nagpur",
        "short_name": "VNIT Nagpur",
        "type": "NIT",
        "location": "Nagpur, Maharashtra",
        "state": "Maharashtra",
        "branch": "Computer Science & Engineering",
        "opening_rank": 3800,
        "closing_rank": 11200,
        "avg_package_lpa": 18.9,
        "annual_fee_lakhs": 1.68,
        "nirf_rank": 41,
    },
    {
        "id": "nit-calicut-cse",
        "institute_name": "National Institute of Technology, Calicut",
        "short_name": "NIT Calicut",
        "type": "NIT",
        "location": "Calicut, Kerala",
        "state": "Kerala",
        "branch": "Computer Science & Engineering",
        "opening_rank": 3500,
        "closing_rank": 10500,
        "avg_package_lpa": 21.2,
        "annual_fee_lakhs": 1.65,
        "nirf_rank": 23,
    },
    {
        "id": "nit-durgapur-ece",
        "institute_name": "National Institute of Technology, Durgapur",
        "short_name": "NIT Durgapur",
        "type": "NIT",
        "location": "Durgapur, West Bengal",
        "state": "West Bengal",
        "branch": "Electronics & Communication Engineering",
        "opening_rank": 12000,
        "closing_rank": 22000,
        "avg_package_lpa": 14.5,
        "annual_fee_lakhs": 1.55,
        "nirf_rank": 43,
    },
    {
        "id": "nit-silchar-ece",
        "institute_name": "National Institute of Technology, Silchar",
        "short_name": "NIT Silchar",
        "type": "NIT",
        "location": "Silchar, Assam",
        "state": "Assam",
        "branch": "Electronics & Communication Engineering",
        "opening_rank": 16000,
        "closing_rank": 28500,
        "avg_package_lpa": 13.8,
        "annual_fee_lakhs": 1.5,
        "nirf_rank": 40,
    },
    {
        "id": "nit-jalandhar-mech",
        "institute_name": "Dr B R Ambedkar National Institute of Technology, Jalandhar",
        "short_name": "NIT Jalandhar",
        "type": "NIT",
        "location": "Jalandhar, Punjab",
        "state": "Punjab",
        "branch": "Mechanical Engineering",
        "opening_rank": 24000,
        "closing_rank": 42000,
        "avg_package_lpa": 11.2,
        "annual_fee_lakhs": 1.55,
        "nirf_rank": 46,
    },

    # --- IIITs ---
    {
        "id": "iiit-h-cse",
        "institute_name": "International Institute of Information Technology, Hyderabad",
        "short_name": "IIIT Hyderabad",
        "type": "IIIT",
        "location": "Hyderabad, Telangana",
        "state": "Telangana",
        "branch": "Computer Science & Engineering",
        "opening_rank": 250,
        "closing_rank": 1680,
        "avg_package_lpa": 32.2,
        "annual_fee_lakhs": 3.8,
        "nirf_rank": 55,
    },
    {
        "id": "iiit-a-cse",
        "institute_name": "Indian Institute of Information Technology, Allahabad",
        "short_name": "IIIT Allahabad",
        "type": "IIIT",
        "location": "Prayagraj, Uttar Pradesh",
        "state": "Uttar Pradesh",
        "branch": "Computer Science & Engineering",
        "opening_rank": 2200,
        "closing_rank": 5900,
        "avg_package_lpa": 25.8,
        "annual_fee_lakhs": 2.1,
        "nirf_rank": 89,
    },
    {
        "id": "iiit-d-cse",
        "institute_name": "Indraprastha Institute of Information Technology, Delhi",
        "short_name": "IIIT Delhi",
        "type": "IIIT",
        "location": "New Delhi, Delhi",
        "state": "Delhi",
        "branch": "Computer Science & Engineering",
        "opening_rank": 3100,
        "closing_rank": 11500,
        "avg_package_lpa": 23.7,
        "annual_fee_lakhs": 4.2,
        "nirf_rank": 62,
    },
    {
        "id": "iiit-lko-cse",
        "institute_name": "Indian Institute of Information Technology, Lucknow",
        "short_name": "IIIT Lucknow",
        "type": "IIIT",
        "location": "Lucknow, Uttar Pradesh",
        "state": "Uttar Pradesh",
        "branch": "Computer Science & Engineering",
        "opening_rank": 5500,
        "closing_rank": 12800,
        "avg_package_lpa": 26.5,
        "annual_fee_lakhs": 2.6,
        "nirf_rank": 110,
    },
    {
        "id": "iiit-gwalior-cse",
        "institute_name": "ABV-Indian Institute of Information Technology and Management, Gwalior",
        "short_name": "IIITM Gwalior",
        "type": "IIIT",
        "location": "Gwalior, Madhya Pradesh",
        "state": "Madhya Pradesh",
        "branch": "Computer Science & Engineering",
        "opening_rank": 4800,
        "closing_rank": 14200,
        "avg_package_lpa": 22.1,
        "annual_fee_lakhs": 2.4,
        "nirf_rank": 88,
    },
    {
        "id": "iiit-jabalpur-ece",
        "institute_name": "PDPM Indian Institute of Information Technology, Design and Manufacturing Jabalpur",
        "short_name": "IIIT Jabalpur",
        "type": "IIIT",
        "location": "Jabalpur, Madhya Pradesh",
        "state": "Madhya Pradesh",
        "branch": "Electronics & Communication Engineering",
        "opening_rank": 18000,
        "closing_rank": 31000,
        "avg_package_lpa": 14.8,
        "annual_fee_lakhs": 1.9,
        "nirf_rank": 97,
    },

    # --- Top Premier State & GFTI Universities ---
    {
        "id": "dtu-cse",
        "institute_name": "Delhi Technological University (formerly DCE), New Delhi",
        "short_name": "DTU Delhi",
        "type": "State/Private",
        "location": "New Delhi, Delhi",
        "state": "Delhi",
        "branch": "Computer Science & Engineering",
        "opening_rank": 3500,
        "closing_rank": 13200,
        "avg_package_lpa": 23.7,
        "annual_fee_lakhs": 2.2,
        "nirf_rank": 29,
    },
    {
        "id": "nsut-cse",
        "institute_name": "Netaji Subhas University of Technology, New Delhi",
        "short_name": "NSUT Delhi",
        "type": "State/Private",
        "location": "New Delhi, Delhi",
        "state": "Delhi",
        "branch": "Computer Science & Engineering",
        "opening_rank": 4100,
        "closing_rank": 14800,
        "avg_package_lpa": 21.6,
        "annual_fee_lakhs": 2.25,
        "nirf_rank": 60,
    },
    {
        "id": "bit-mesra-cse",
        "institute_name": "Birla Institute of Technology, Mesra",
        "short_name": "BIT Mesra",
        "type": "GFTI",
        "location": "Ranchi, Jharkhand",
        "state": "Jharkhand",
        "branch": "Computer Science & Engineering",
        "opening_rank": 9500,
        "closing_rank": 21500,
        "avg_package_lpa": 19.2,
        "annual_fee_lakhs": 3.4,
        "nirf_rank": 53,
    },
    {
        "id": "pec-cse",
        "institute_name": "Punjab Engineering College, Chandigarh",
        "short_name": "PEC Chandigarh",
        "type": "GFTI",
        "location": "Chandigarh, UT",
        "state": "Chandigarh",
        "branch": "Computer Science & Engineering",
        "opening_rank": 8200,
        "closing_rank": 18900,
        "avg_package_lpa": 17.6,
        "annual_fee_lakhs": 2.1,
        "nirf_rank": 87,
    },
    {
        "id": "bits-pilani-cse",
        "institute_name": "BITS Pilani, Rajasthan (Admission via BITSAT / JEE Top 1%)",
        "short_name": "BITS Pilani",
        "type": "State/Private",
        "location": "Pilani, Rajasthan",
        "state": "Rajasthan",
        "branch": "Computer Science & Engineering",
        "opening_rank": 800,
        "closing_rank": 4500,
        "avg_package_lpa": 30.5,
        "annual_fee_lakhs": 5.4,
        "nirf_rank": 25,
    },
    {
        "id": "coep-cse",
        "institute_name": "COEP Technological University, Pune",
        "short_name": "COEP Pune",
        "type": "State/Private",
        "location": "Pune, Maharashtra",
        "state": "Maharashtra",
        "branch": "Computer Science & Engineering",
        "opening_rank": 5000,
        "closing_rank": 16500,
        "avg_package_lpa": 16.5,
        "annual_fee_lakhs": 1.4,
        "nirf_rank": 73,
    },
    {
        "id": "vjti-cse",
        "institute_name": "Veermata Jijabai Technological Institute, Mumbai",
        "short_name": "VJTI Mumbai",
        "type": "State/Private",
        "location": "Mumbai, Maharashtra",
        "state": "Maharashtra",
        "branch": "Computer Science & Engineering",
        "opening_rank": 4200,
        "closing_rank": 14200,
        "avg_package_lpa": 18.0,
        "annual_fee_lakhs": 1.2,
        "nirf_rank": 82,
    },
    {
        "id": "rvce-cse",
        "institute_name": "RV College of Engineering, Bengaluru",
        "short_name": "RVCE Bengaluru",
        "type": "State/Private",
        "location": "Bengaluru, Karnataka",
        "state": "Karnataka",
        "branch": "Computer Science & Engineering",
        "opening_rank": 11000,
        "closing_rank": 29000,
        "avg_package_lpa": 18.5,
        "annual_fee_lakhs": 3.8,
        "nirf_rank": 96,
    },
    {
        "id": "vit-vellore-cse",
        "institute_name": "Vellore Institute of Technology, Vellore",
        "short_name": "VIT Vellore",
        "type": "State/Private",
        "location": "Vellore, Tamil Nadu",
        "state": "Tamil Nadu",
        "branch": "Computer Science & Engineering",
        "opening_rank": 15000,
        "closing_rank": 48000,
        "avg_package_lpa": 11.5,
        "annual_fee_lakhs": 2.8,
        "nirf_rank": 11,
    },
    {
        "id": "thapar-cse",
        "institute_name": "Thapar Institute of Engineering and Technology, Patiala",
        "short_name": "Thapar Patiala",
        "type": "State/Private",
        "location": "Patiala, Punjab",
        "state": "Punjab",
        "branch": "Computer Science & Engineering",
        "opening_rank": 18000,
        "closing_rank": 52000,
        "avg_package_lpa": 12.8,
        "annual_fee_lakhs": 4.5,
        "nirf_rank": 20,
    }
]

def calculate_jee_main_percentile(total_score: float) -> float:
    """Calculates estimated JEE Main Percentile from Total JEE Score (out of 300)."""
    if total_score >= 300:
        return 100.0
    if total_score <= 0:
        return 0.5
    
    # Formula modeled on real normalized NTA JEE Main score vs percentile distributions
    if total_score >= 270:
        pct = 99.95 + (total_score - 270) / 30 * 0.05
    elif total_score >= 220:
        pct = 99.20 + (total_score - 220) / 50 * 0.75
    elif total_score >= 180:
        pct = 97.80 + (total_score - 180) / 40 * 1.40
    elif total_score >= 140:
        pct = 94.50 + (total_score - 140) / 40 * 3.30
    elif total_score >= 100:
        pct = 88.00 + (total_score - 100) / 40 * 6.50
    elif total_score >= 60:
        pct = 72.00 + (total_score - 60) / 40 * 16.00
    else:
        pct = max(1.0, 10.0 + (total_score / 60) * 62.0)
    
    return round(min(100.0, max(0.1, pct)), 4)


def calculate_air_from_percentile(percentile: float) -> int:
    """Calculates All India Rank (AIR) from JEE Main Percentile based on ~1.4M candidates."""
    total_candidates = 1400000
    air = math.floor((100.0 - percentile) / 100.0 * total_candidates)
    return max(1, air)


def calculate_category_rank(air: int, category: str) -> int:
    """Estimates Category Rank multiplier based on JoSAA reservation statistics."""
    multipliers = {
        "OPEN": 1.0,
        "OBC-NCL": 0.27,
        "EWS": 0.10,
        "SC": 0.15,
        "ST": 0.075,
        "PwD": 0.05
    }
    mult = multipliers.get(category.upper(), 1.0)
    return max(1, int(air * mult))


@router.get("", tags=["JEE Predictor"])
@router.get("/", tags=["JEE Predictor"])
async def predictor_info():
    """Returns metadata and usage instructions for the JEE Predictor endpoint."""
    return {
        "endpoint": "/api/v1/predict",
        "method": "POST",
        "description": "Submit candidate JEE subject marks (Maths, Physics, Chemistry), score, percentile, AIR, and category to retrieve college predictions and JoSAA choice preference order.",
        "sample_request": {
            "input_mode": "marks",
            "maths_marks": 90,
            "physics_marks": 85,
            "chemistry_marks": 80,
            "category": "OPEN",
            "preferred_branch": "All Branches",
            "institution_type": "All"
        }
    }

@router.post("", response_model=PredictorResponse)
@router.post("/", response_model=PredictorResponse)
async def predict_colleges(req: PredictorRequest):
    """
    JEE Marks & Rank Based College Predictor Endpoint.
    Takes candidate's subject marks / JEE scores / percentile / category / branch preferences,
    calculates candidate JEE Main Percentile & AIR, filtersJoSAA/CSAB opening & closing cutoffs,
    and returns admission probabilities + JoSAA choice filling recommendations.
    """
    mode = req.input_mode.lower()
    
    maths = req.maths_marks
    physics = req.physics_marks
    chemistry = req.chemistry_marks
    
    # Calculate Total JEE Score
    if req.jee_main_marks is not None:
        total_score = req.jee_main_marks
    else:
        total_score = maths + physics + chemistry
    
    total_score = max(0.0, min(300.0, total_score))
    
    # Calculate Percentile & AIR based on input mode
    if mode == "percentile" and req.jee_main_percentile is not None:
        percentile = req.jee_main_percentile
        air = calculate_air_from_percentile(percentile)
    elif mode == "rank" and req.jee_main_rank is not None:
        air = req.jee_main_rank
        percentile = max(0.1, round(100.0 - (air / 1400000.0 * 100.0), 4))
    elif mode == "advanced" and req.jee_advanced_rank is not None:
        air = req.jee_advanced_rank
        percentile = 99.8  # Top tier JEE Advanced qualifier
    else:
        # Default: Calculate from JEE subject marks
        percentile = calculate_jee_main_percentile(total_score)
        air = calculate_air_from_percentile(percentile)
    
    category = req.category.upper()
    cat_rank = calculate_category_rank(air, category)
    
    predictions: List[CollegePrediction] = []
    
    for col in COLLEGE_DATABASE:
        # Filter by institution type if specified
        if req.institution_type != "All":
            if req.institution_type == "IIT" and col["type"] != "IIT":
                continue
            if req.institution_type == "NIT" and col["type"] != "NIT":
                continue
            if req.institution_type == "IIIT" and col["type"] != "IIIT":
                continue
            if req.institution_type == "GFTI" and col["type"] != "GFTI":
                continue
            if req.institution_type == "State/Private" and col["type"] != "State/Private":
                continue
        
        # Filter by branch if specified
        if req.preferred_branch != "All Branches":
            # Match substring (case insensitive)
            if req.preferred_branch.lower() not in col["branch"].lower() and col["branch"].lower() not in req.preferred_branch.lower():
                continue
        
        # Determine candidate effective rank to compare against closing rank
        effective_rank = cat_rank if category != "OPEN" else air
        
        # Adjust cutoffs for Category reservation factor
        closing_rank = col["closing_rank"]
        opening_rank = col["opening_rank"]
        
        if category == "OBC-NCL":
            closing_rank = int(closing_rank * 0.35)
            opening_rank = int(opening_rank * 0.35)
        elif category == "EWS":
            closing_rank = int(closing_rank * 0.20)
            opening_rank = int(opening_rank * 0.20)
        elif category == "SC":
            closing_rank = int(closing_rank * 0.15)
            opening_rank = int(opening_rank * 0.15)
        elif category == "ST":
            closing_rank = int(closing_rank * 0.10)
            opening_rank = int(opening_rank * 0.10)
            
        closing_rank = max(1, closing_rank)
        opening_rank = max(1, opening_rank)
        
        # Calculate Chance Level
        if effective_rank <= int(closing_rank * 0.85):
            chance_level = "High"
            chance_pct = min(99.0, max(85.0, round(100.0 - (effective_rank / (closing_rank * 0.85)) * 15.0, 1)))
            reason = f"Your rank ({effective_rank:,}) is comfortably within previous years' closing cutoff ({closing_rank:,}). High probability of seat allotment."
        elif effective_rank <= int(closing_rank * 1.15):
            chance_level = "Moderate"
            chance_pct = round(50.0 + (1.15 * closing_rank - effective_rank) / (0.30 * closing_rank) * 34.0, 1)
            reason = f"Your rank ({effective_rank:,}) is close to the cutoff border ({closing_rank:,}). Likely in JoSAA later rounds / CSAB special rounds."
        elif effective_rank <= int(closing_rank * 2.20):
            chance_level = "Dream"
            chance_pct = max(10.0, round(45.0 - (effective_rank - 1.15 * closing_rank) / (1.05 * closing_rank) * 35.0, 1))
            reason = f"Stretch/Dream option. Closing rank is {closing_rank:,}. Recommend putting in top choice preference order."
        else:
            # Skip colleges way beyond reach (effective rank > 2.5x closing rank)
            continue
            
        prediction = CollegePrediction(
            id=col["id"],
            institute_name=col["institute_name"],
            short_name=col["short_name"],
            type=col["type"],
            location=col["location"],
            state=col["state"],
            branch=col["branch"],
            category=category,
            opening_rank=opening_rank,
            closing_rank=closing_rank,
            candidate_rank=effective_rank,
            chance_level=chance_level,
            chance_percentage=chance_pct,
            avg_package_lpa=col["avg_package_lpa"],
            annual_fee_lakhs=col["annual_fee_lakhs"],
            nirf_rank=col.get("nirf_rank"),
            recommendation_reason=reason
        )
        predictions.append(prediction)
        
    # Sort predictions: High chance first, then Moderate, then Dream, sorted by Institute NIRF/Rank
    predictions.sort(key=lambda x: (
        0 if x.chance_level == "High" else (1 if x.chance_level == "Moderate" else 2),
        x.nirf_rank or 999
    ))
    
    high_count = sum(1 for p in predictions if p.chance_level == "High")
    mod_count = sum(1 for p in predictions if p.chance_level == "Moderate")
    dream_count = sum(1 for p in predictions if p.chance_level == "Dream")
    
    # Generate JoSAA Choice Filling Preference List
    choice_filling: List[ChoiceFillingItem] = []
    
    # Choice Strategy: 1. Put Dream options at top, 2. Moderate in middle, 3. High chance safety options at bottom
    ordered_choices = [p for p in predictions if p.chance_level == "Dream"][:3] + \
                      [p for p in predictions if p.chance_level == "Moderate"][:4] + \
                      [p for p in predictions if p.chance_level == "High"][:5]
                      
    for idx, choice in enumerate(ordered_choices, start=1):
        if choice.chance_level == "Dream":
            strat = "Ambitious top choice. Gives you a shot at a top institute in JoSAA Round 1-3."
        elif choice.chance_level == "Moderate":
            strat = "Balanced choice. Solid probability of seat lock in JoSAA Round 4-6."
        else:
            strat = "Safe anchor option. Guaranteed allotment to protect your counselling seat."
            
        choice_filling.append(ChoiceFillingItem(
            preference_number=idx,
            institute_name=choice.short_name,
            branch=choice.branch,
            type=choice.type,
            closing_rank=choice.closing_rank,
            chance_level=choice.chance_level,
            strategy_note=strat
        ))

    return PredictorResponse(
        total_score=round(total_score, 1),
        maths_score=round(maths, 1),
        physics_score=round(physics, 1),
        chemistry_score=round(chemistry, 1),
        estimated_percentile=percentile,
        estimated_air=air,
        category_rank=cat_rank,
        category=category,
        gender=req.gender,
        input_mode=mode,
        total_matches=len(predictions),
        high_chance_count=high_count,
        moderate_chance_count=mod_count,
        dream_chance_count=dream_count,
        predictions=predictions,
        choice_filling_order=choice_filling
    )
