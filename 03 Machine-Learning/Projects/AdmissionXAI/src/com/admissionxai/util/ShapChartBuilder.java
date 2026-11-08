package com.admissionxai.util;

import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;

import java.util.Map;

public class ShapChartBuilder {

    public static String prettifyFeatureName(String feature) {
        if (feature == null) return "";
        switch (feature) {
            case "physics_marks": return "Physics";
            case "chemistry_marks": return "Chemistry";
            case "biology_marks": return "Biology";
            case "computer_science_marks": return "Computer Science";
            case "math_marks": return "Math";
            case "english_marks": return "English";
            case "entrance_test_score": return "Entrance Test";
            case "extracurriculars": return "Extra Curricular";
            case "documents_complete": return "Docs Complete";
            default:
                String name = feature.replace("_", " ");
                if (name.length() > 0) {
                    name = Character.toUpperCase(name.charAt(0)) + name.substring(1);
                }
                return name;
        }
    }

    public static VBox createShapChart(Map<String, Double> shapValues) {
        VBox container = new VBox(6);
        container.setStyle("-fx-background-color: transparent;");

        if (shapValues == null || shapValues.isEmpty()) {
            Label emptyLabel = new Label("No explanation data available.");
            emptyLabel.setStyle("-fx-text-fill: #64748B; -fx-font-style: italic;");
            container.getChildren().add(emptyLabel);
            return container;
        }

        // Determine max absolute value for dynamic bar scaling
        double maxAbsVal = 0.4; 
        for (double val : shapValues.values()) {
            if (Math.abs(val) > maxAbsVal) {
                maxAbsVal = Math.abs(val);
            }
        }

        final double maxBarWidth = 84.0; // Max width in pixels per side

        for (Map.Entry<String, Double> entry : shapValues.entrySet()) {
            String feature = entry.getKey();
            double value = entry.getValue();

            HBox row = new HBox(6);
            row.setAlignment(Pos.CENTER_LEFT);

            // 1. Feature Name (Left Label)
            Label nameLabel = new Label(prettifyFeatureName(feature));
            nameLabel.setMinWidth(145.0);
            nameLabel.setPrefWidth(145.0);
            nameLabel.setAlignment(Pos.CENTER_LEFT);
            nameLabel.setStyle("-fx-text-fill: #1E293B; -fx-font-size: 11px; -fx-font-weight: bold;");

            // 2. Chart Area (Left Pane + Center Axis + Right Pane)
            HBox chartArea = new HBox();
            chartArea.setPrefWidth(170); 
            chartArea.setAlignment(Pos.CENTER);

            // Left side (Negative values)
            StackPane leftPane = new StackPane();
            leftPane.setPrefWidth(maxBarWidth);
            leftPane.setAlignment(Pos.CENTER_RIGHT);

            // Center Axis Line
            Rectangle axisLine = new Rectangle(2, 16);
            axisLine.setFill(Color.web("#CBD5E1"));

            // Right side (Positive values)
            StackPane rightPane = new StackPane();
            rightPane.setPrefWidth(maxBarWidth);
            rightPane.setAlignment(Pos.CENTER_LEFT);

            double barWidth = (Math.abs(value) / maxAbsVal) * maxBarWidth;
            Rectangle bar = new Rectangle(barWidth, 12);
            bar.setArcWidth(4);
            bar.setArcHeight(4);

            if (value >= 0) {
                bar.setFill(Color.web("#15803D")); // Dark Green
                rightPane.getChildren().add(bar);
            } else {
                bar.setFill(Color.web("#B91C1C")); // Dark Red
                leftPane.getChildren().add(bar);
            }

            chartArea.getChildren().addAll(leftPane, axisLine, rightPane);

            // 3. SHAP Value Label (Right Label)
            Label valLabel = new Label(String.format("%+.2f", value));
            valLabel.setMinWidth(50.0);
            valLabel.setPrefWidth(50.0);
            valLabel.setAlignment(Pos.CENTER_RIGHT);
            if (value >= 0) {
                valLabel.setStyle("-fx-text-fill: #15803D; -fx-font-size: 11px; -fx-font-weight: bold;");
            } else {
                valLabel.setStyle("-fx-text-fill: #B91C1C; -fx-font-size: 11px; -fx-font-weight: bold;");
            }

            row.getChildren().addAll(nameLabel, chartArea, valLabel);
            container.getChildren().add(row);
        }

        return container;
    }
}