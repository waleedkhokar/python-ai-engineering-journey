package com.admissionxai.model;
import java.util.Map;

public class Student {
    // Core Identifiers & Info
    private String studentId;
    private String name;

    // Academic Subject Marks (Week 2 Roadmap requirement)
    private double physicsMarks;
    private double chemistryMarks;
    private double biologyMarks;
    private double computerScienceMarks;
    private double mathMarks;
    private double englishMarks;

    // Application Factors
    private int entranceTestScore;
    private int extracurriculars;
    private boolean documentsComplete;
    private String docStatus; // "Complete", "Missing Doc", "Incomplete"
    private String readyStatus; // "Ready", "Pending", "Not Ready"

    // Model 1: Admission Decision
    private String decision; // "Selected" / "Not Selected"
    private double confidence; // e.g. 0.924 -> 92.4%
    private Map<String, Double> admissionShapValues;

    // Model 2: Program Recommendation
    private String recommendedProgram; // e.g. "B.Tech / CSE"
    private double programConfidence;
    private Map<String, Double> programShapValues;

    public Student(String studentId, String name, double physicsMarks, double chemistryMarks,
                   double biologyMarks, double computerScienceMarks, double mathMarks,
                   double englishMarks, int entranceTestScore, int extracurriculars,
                   boolean documentsComplete, String docStatus, String readyStatus) {
        this.studentId = studentId;
        this.name = name;
        this.physicsMarks = physicsMarks;
        this.chemistryMarks = chemistryMarks;
        this.biologyMarks = biologyMarks;
        this.computerScienceMarks = computerScienceMarks;
        this.mathMarks = mathMarks;
        this.englishMarks = englishMarks;
        this.entranceTestScore = entranceTestScore;
        this.extracurriculars = extracurriculars;
        this.documentsComplete = documentsComplete;
        this.docStatus = docStatus;
        this.readyStatus = readyStatus;
    }

    // Formatted GPA display for the table preview (e.g. "3.91 / 4.00")
    public String getGpaFormatted() {
        double avg = (physicsMarks + chemistryMarks + biologyMarks +
                      computerScienceMarks + mathMarks + englishMarks) / 6.0;
        double gpaScale = (avg / 100.0) * 4.0;
        return String.format("%.2f / 4.00", gpaScale);
    }

    // Getters & Setters
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
    public double getPhysicsMarks() { return physicsMarks; }
    public double getChemistryMarks() { return chemistryMarks; }
    public double getBiologyMarks() { return biologyMarks; }
    public double getComputerScienceMarks() { return computerScienceMarks; }
    public double getMathMarks() { return mathMarks; }
    public double getEnglishMarks() { return englishMarks; }
    public int getEntranceTestScore() { return entranceTestScore; }
    public int getExtracurriculars() { return extracurriculars; }
    public boolean isDocumentsComplete() { return documentsComplete; }
    public String getDocStatus() { return docStatus; }
    public String getReadyStatus() { return readyStatus; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public Map<String, Double> getAdmissionShapValues() { return admissionShapValues; }
    public void setAdmissionShapValues(Map<String, Double> admissionShapValues) { this.admissionShapValues = admissionShapValues; }

    public String getRecommendedProgram() { return recommendedProgram; }
    public void setRecommendedProgram(String recommendedProgram) { this.recommendedProgram = recommendedProgram; }

    public double getProgramConfidence() { return programConfidence; }
    public void setProgramConfidence(double programConfidence) { this.programConfidence = programConfidence; }

    public Map<String, Double> getProgramShapValues() { return programShapValues; }
    public void setProgramShapValues(Map<String, Double> programShapValues) { this.programShapValues = programShapValues; }
}

