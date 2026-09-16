import pandas as pd
from typing import Any

Student_data: Dict[str, list[Any]] = {
"name": ["Waledd", "Qasim", "Jawad"],
"Roll nO":  [1,2,3],
"Education": ['BSCS','BSCS','BSCS']    
} 


df: pd.DataFrame = pd.DataFrame(Student_data)
df


# from play import playsound
# playsound
# !pip install playsound
