from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictorRequest(BaseModel):
    input_mode: str = Field("marks", description="Input mode: 'marks', 'percentile', 'rank', or 'advanced'")
    maths_marks: float = Field(80.0, ge=0, le=100, description="Marks in Mathematics (out of 100)")
    physics_marks: float = Field(80.0, ge=0, le=100, description="Marks in Physics (out of 100)")
    chemistry_marks: float = Field(80.0, ge=0, le=100, description="Marks in Chemistry (out of 100)")
    jee_main_marks: Optional[float] = Field(None, ge=0, le=300, description="Explicit total JEE Main marks (out of 300)")
    jee_main_percentile: Optional[float] = Field(None, ge=0, le=100, description="Direct JEE Main Percentile")
    jee_main_rank: Optional[int] = Field(None, ge=1, description="Direct JEE Main All India Rank (AIR)")
    jee_advanced_rank: Optional[int] = Field(None, ge=1, description="JEE Advanced Rank for IIT predictions")
    category: str = Field("OPEN", description="Category: OPEN, OBC-NCL, EWS, SC, ST, PwD")
    gender: str = Field("Gender-Neutral", description="Gender quota: Gender-Neutral or Female-Only")
    home_state: str = Field("All", description="Home state of candidate")
    preferred_branch: str = Field("All Branches", description="Preferred engineering branch")
    institution_type: str = Field("All", description="Institution filter: All, IIT, NIT, IIIT, GFTI, State/Private")

class CollegePrediction(BaseModel):
    id: str
    institute_name: str
    short_name: str
    type: str
    location: str
    state: str
    branch: str
    category: str
    opening_rank: int
    closing_rank: int
    candidate_rank: int
    chance_level: str  # "High" | "Moderate" | "Dream"
    chance_percentage: float
    avg_package_lpa: float
    annual_fee_lakhs: float
    nirf_rank: Optional[int] = None
    recommendation_reason: str

class ChoiceFillingItem(BaseModel):
    preference_number: int
    institute_name: str
    branch: str
    type: str
    closing_rank: int
    chance_level: str
    strategy_note: str

class PredictorResponse(BaseModel):
    total_score: float
    maths_score: float
    physics_score: float
    chemistry_score: float
    estimated_percentile: float
    estimated_air: int
    category_rank: int
    category: str
    gender: str
    input_mode: str
    total_matches: int
    high_chance_count: int
    moderate_chance_count: int
    dream_chance_count: int
    predictions: List[CollegePrediction]
    choice_filling_order: List[ChoiceFillingItem]
