package com.admissionxai.controller;

import com.admissionxai.model.Student;
import com.admissionxai.util.ShapChartBuilder;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

import java.util.Map;

/**
 * Controller for results.fxml - the standalone "XAI Model Explanation" window.
 * Opened/updated from MainController whenever a candidate row is double-clicked
 * or after a fresh XAI run. Holds exactly the logic that used to live in
 * MainController's updateExplanationPanel() + handleSendEmail().
 */
public class ResultController {

    @FXML private Label lblSelectedStudent;
    @FXML private Label lblDecisionStatus;
    @FXML private Label lblConfidence;
    @FXML private HBox programInfoBox;
    @FXML private VBox shapChartContainer;
    @FXML private Button btnSendEmail;
    @FXML private Button btnSendSelectionEmail;

    private Student currentStudent;

    public void showStudent(Student student) {
        this.currentStudent = student;

        lblSelectedStudent.setText("Selected Candidate: " + student.getName() + " (" + student.getStudentId() + ")");
        lblDecisionStatus.setText(student.getDecision() != null ? student.getDecision() : "Pending Analysis");

        boolean isSelected = "Selected".equalsIgnoreCase(student.getDecision());
        boolean isNotSelected = "Not Selected".equalsIgnoreCase(student.getDecision());
        boolean hasAnalysis = student.getDecision() != null;

        if (hasAnalysis) {
            lblConfidence.setText(String.format("%.1f%%", student.getConfidence()));
        } else {
            lblConfidence.setText("-- %");
        }

        if (isSelected) {
            lblDecisionStatus.setStyle("-fx-text-fill: #15803D; -fx-font-weight: bold;");
            programInfoBox.setVisible(true);
            programInfoBox.setManaged(true);
        } else {
            if (isNotSelected) {
                lblDecisionStatus.setStyle("-fx-text-fill: #B91C1C; -fx-font-weight: bold;");
            } else {
                lblDecisionStatus.setStyle("-fx-text-fill: #B45309; -fx-font-weight: bold;");
            }
            programInfoBox.setVisible(false);
            programInfoBox.setManaged(false);
        }

        btnSendEmail.setVisible(isNotSelected);
        btnSendEmail.setManaged(isNotSelected);
        btnSendSelectionEmail.setVisible(isSelected);
        btnSendSelectionEmail.setManaged(isSelected);

        // Render SHAP Chart(s)
        shapChartContainer.getChildren().clear();
        shapChartContainer.setSpacing(12);

        if (student.getAdmissionShapValues() != null && !student.getAdmissionShapValues().isEmpty()) {
            if (isSelected) {
                Label lblAdmissionHeader = new Label("Admission SHAP (Decision)");
                lblAdmissionHeader.setStyle("-fx-text-fill: #0F172A; -fx-font-size: 12px; -fx-font-weight: bold; -fx-padding: 4 0 0 0;");
                VBox admissionChart = ShapChartBuilder.createShapChart(student.getAdmissionShapValues());

                shapChartContainer.getChildren().addAll(lblAdmissionHeader, admissionChart);

                if (student.getProgramShapValues() != null && !student.getProgramShapValues().isEmpty()) {
                    String progName = student.getRecommendedProgram() != null ? student.getRecommendedProgram() : "Program";
                    Label lblProgramHeader = new Label("Program SHAP (" + progName + " Recommendation)");
                    lblProgramHeader.setStyle("-fx-text-fill: #0F172A; -fx-font-size: 12px; -fx-font-weight: bold; -fx-padding: 8 0 0 0;");
                    VBox programChart = ShapChartBuilder.createShapChart(student.getProgramShapValues());

                    shapChartContainer.getChildren().addAll(lblProgramHeader, programChart);
                }
            } else {
                Label lblAdmissionHeader = new Label("Admission SHAP (Decision)");
                lblAdmissionHeader.setStyle("-fx-text-fill: #0F172A; -fx-font-size: 12px; -fx-font-weight: bold; -fx-padding: 4 0 0 0;");
                VBox admissionChart = ShapChartBuilder.createShapChart(student.getAdmissionShapValues());

                shapChartContainer.getChildren().addAll(lblAdmissionHeader, admissionChart);
            }
        } else {
            Label placeholder = new Label("Run XAI Analysis to calculate SHAP feature contributions.");
            placeholder.setStyle("-fx-text-fill: #6B7280; -fx-font-style: italic;");
            shapChartContainer.getChildren().add(placeholder);
        }
    }

    @FXML
    private void handleSendEmail(ActionEvent event) {
        if (currentStudent != null && "Not Selected".equalsIgnoreCase(currentStudent.getDecision())) {
            StringBuilder emailBody = new StringBuilder();
            emailBody.append(String.format("Dear %s,\n\n", currentStudent.getName()));
            emailBody.append("After reviewing your application, we regret to inform you that you have not been selected for admission at this time.\n\n");
            emailBody.append("To maintain transparency, we use Explainable AI (XAI) to analyze admission decisions. Below are the key feature contribution factors from our model (positive values favor selection, negative values favor rejection):\n");

            if (currentStudent.getAdmissionShapValues() != null) {
                for (Map.Entry<String, Double> entry : currentStudent.getAdmissionShapValues().entrySet()) {
                    String featureName = ShapChartBuilder.prettifyFeatureName(entry.getKey());
                    double value = entry.getValue();
                    emailBody.append(String.format(" - %s: %+.4f\n", featureName, value));
                }
            }

            emailBody.append("\nThank you for your interest in our programs. We wish you the best in your future endeavors.\n\n");
            emailBody.append("Sincerely,\nAdmission Committee");

            System.out.println("----- DISPATCHING EMAIL -----");
            System.out.println("To: " + currentStudent.getName() + " (ID: " + currentStudent.getStudentId() + ")");
            System.out.println(emailBody.toString());
            System.out.println("-----------------------------");

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Rejection Email Dispatched");
            alert.setHeaderText("Email Sent Successfully to " + currentStudent.getName());

            TextArea textArea = new TextArea(emailBody.toString());
            textArea.setEditable(false);
            textArea.setWrapText(true);
            textArea.setPrefHeight(250);
            textArea.setPrefWidth(450);
            alert.getDialogPane().setContent(textArea);

            alert.showAndWait();
        }
    }

    @FXML
    private void handleSendSelectionEmail(ActionEvent event) {
        if (currentStudent != null && "Selected".equalsIgnoreCase(currentStudent.getDecision())) {
            StringBuilder emailBody = new StringBuilder();
            emailBody.append(String.format("Dear %s,\n\n", currentStudent.getName()));
            emailBody.append(String.format("We are pleased to inform you that you have been selected for admission. Based on your academic profile and application factors, we highly recommend you for the %s program.\n\n", currentStudent.getRecommendedProgram()));
            emailBody.append("To maintain transparency, we use Explainable AI (XAI) to analyze admission decisions. Below are the key feature contribution factors from our model (positive values favor selection, negative values favor rejection):\n");

            if (currentStudent.getAdmissionShapValues() != null) {
                for (Map.Entry<String, Double> entry : currentStudent.getAdmissionShapValues().entrySet()) {
                    String featureName = ShapChartBuilder.prettifyFeatureName(entry.getKey());
                    double value = entry.getValue();
                    emailBody.append(String.format(" - %s: %+.4f\n", featureName, value));
                }
            }

            emailBody.append("\nCongratulations on your selection. We look forward to welcoming you to our campus.\n\n");
            emailBody.append("Sincerely,\nAdmission Committee");

            System.out.println("----- DISPATCHING EMAIL -----");
            System.out.println("To: " + currentStudent.getName() + " (ID: " + currentStudent.getStudentId() + ")");
            System.out.println(emailBody.toString());
            System.out.println("-----------------------------");

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Selection Email Dispatched");
            alert.setHeaderText("Email Sent Successfully to " + currentStudent.getName());

            TextArea textArea = new TextArea(emailBody.toString());
            textArea.setEditable(false);
            textArea.setWrapText(true);
            textArea.setPrefHeight(250);
            textArea.setPrefWidth(450);
            alert.getDialogPane().setContent(textArea);

            alert.showAndWait();
        }
    }
}

