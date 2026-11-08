package com.admissionxai.controller;
import com.admissionxai.model.Student;
import com.admissionxai.service.PythonBridge;
import com.admissionxai.util.CSVReader;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.input.MouseButton;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainController {

    // Left Sidebar
    @FXML private Button btnUpload;
    @FXML private Label lblFileName;
    @FXML private Label lblRecordCount;
    @FXML private Button btnRunXai;

    // Table Controls
    @FXML private TextField txtSearch;
    @FXML private TableView<Student> tblStudents;
    @FXML private TableColumn<Student, String> colId;
    @FXML private TableColumn<Student, String> colGpa;
    @FXML private TableColumn<Student, Integer> colGre;
    @FXML private TableColumn<Student, String> colStatus;

    private ObservableList<Student> studentList = FXCollections.observableArrayList();
    private FilteredList<Student> filteredStudents;
    private File activeCsvFile;

    // Separate details window (results.fxml / ResultController)
    private Stage resultStage;
    private ResultController resultController;

    @FXML
    public void initialize() {
        setupTableColumns();
        setupSearchFilter();
        setupTableRowOpening();

        // Auto-load default dataset if available
        File defaultFile = new File("data/students.csv");
        if (defaultFile.exists()) {
            loadCsvData(defaultFile);
        }
    }

    private void setupTableColumns() {
        colId.setCellValueFactory(new PropertyValueFactory<>("studentId"));
        colGpa.setCellValueFactory(new PropertyValueFactory<>("gpaFormatted"));
        colGre.setCellValueFactory(new PropertyValueFactory<>("entranceTestScore"));
        colStatus.setCellValueFactory(new PropertyValueFactory<>("decision"));
    }

    private void setupSearchFilter() {
        filteredStudents = new FilteredList<>(studentList, p -> true);
        txtSearch.textProperty().addListener((observable, oldValue, newValue) -> {
            filteredStudents.setPredicate(student -> {
                if (newValue == null || newValue.isEmpty()) {
                    return true;
                }
                String lowerCaseFilter = newValue.toLowerCase();
                return student.getStudentId().toLowerCase().contains(lowerCaseFilter) ||
                       student.getName().toLowerCase().contains(lowerCaseFilter);
            });
        });
        tblStudents.setItems(filteredStudents);
    }

    // Double-click a row to open (or bring to front / refresh) the details window.
    // Using double-click rather than single-click/selection so browsing rows with
    // the keyboard or mouse doesn't keep popping the window to the front.
    private void setupTableRowOpening() {
        tblStudents.setRowFactory(tv -> {
            TableRow<Student> row = new TableRow<>();
            row.setOnMouseClicked(event -> {
                if (event.getClickCount() == 2 && !row.isEmpty() && event.getButton() == MouseButton.PRIMARY) {
                    openResultWindow(row.getItem());
                }
            });
            return row;
        });
    }

    private void openResultWindow(Student student) {
        try {
            if (resultStage == null) {
                URL fxmlLocation = getClass().getResource("/com/admissionxai/view/results.fxml");
                if (fxmlLocation == null) {
                    showAlert("Missing File", "Could not find results.fxml in /com/admissionxai/view/");
                    return;
                }
                FXMLLoader loader = new FXMLLoader(fxmlLocation);
                Parent root = loader.load();
                resultController = loader.getController();

                Scene scene = new Scene(root);
                URL cssLocation = getClass().getResource("/com/admissionxai/view/styles.css");
                if (cssLocation != null) {
                    scene.getStylesheets().add(cssLocation.toExternalForm());
                }

                resultStage = new Stage();
                resultStage.setTitle("XAI Model Explanation");
                resultStage.setScene(scene);
                if (tblStudents.getScene() != null && tblStudents.getScene().getWindow() != null) {
                    resultStage.initOwner(tblStudents.getScene().getWindow());
                }
            }

            resultController.showStudent(student);
            resultStage.show();
            resultStage.toFront();
        } catch (Exception e) {
            e.printStackTrace();
            showAlert("Window Error", "Failed to open the details window: " + e.getMessage());
        }
    }

    @FXML
    private void handleUploadCsv(ActionEvent event) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Open Student CSV File");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showOpenDialog(btnUpload.getScene().getWindow());

        if (file != null) {
            loadCsvData(file);
        }
    }

    private void loadCsvData(File file) {
        this.activeCsvFile = file;
        lblFileName.setText(file.getName());

        List<Student> loaded = CSVReader.readStudentsFromCSV(file.getAbsolutePath());
        studentList.setAll(loaded);
        lblRecordCount.setText(String.valueOf(studentList.size()));

        if (!studentList.isEmpty()) {
            tblStudents.getSelectionModel().selectFirst();
        }
    }

    @FXML
    private void handleRunXAI(ActionEvent event) {
        if (activeCsvFile == null) {
            showAlert("No CSV File", "Please upload or select a CSV dataset first.");
            return;
        }

        btnRunXai.setDisable(true);
        btnRunXai.setText("⚡  Running Analysis...");

        // Execute Python bridge script
        String jsonResult = PythonBridge.runPredictScript(activeCsvFile.getAbsolutePath());

        if (jsonResult != null && !jsonResult.trim().isEmpty()) {
            parsePredictionsJson(jsonResult);
            tblStudents.refresh();

            // If the details window is open, refresh it with the latest data
            // for whichever student is currently selected.
            if (resultController != null && resultStage != null && resultStage.isShowing()) {
                Student current = tblStudents.getSelectionModel().getSelectedItem();
                if (current != null) {
                    resultController.showStudent(current);
                }
            }
        } else {
            showAlert("Execution Error", "Failed to retrieve predictions from Python pipeline.");
        }

        btnRunXai.setDisable(false);
        btnRunXai.setText("⚡  RUN XAI ANALYSIS");
    }

    private void parsePredictionsJson(String jsonStr) {
        try {
            JSONArray jsonArray = new JSONArray(jsonStr);

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                String id = obj.optString("student_id");

                for (Student student : studentList) {
                    if (student.getStudentId().equalsIgnoreCase(id)) {
                        student.setDecision(obj.optString("decision", "Pending"));
                        student.setConfidence(obj.optDouble("confidence", 0.0));

                        // Parse program recommendation if Selected
                        if ("Selected".equalsIgnoreCase(student.getDecision())) {
                            student.setRecommendedProgram(obj.optString("recommended_program", "N/A"));
                            student.setProgramConfidence(obj.optDouble("program_confidence", 0.0));

                            if (obj.has("program_shap_values") && !obj.isNull("program_shap_values")) {
                                JSONObject shapObj = obj.getJSONObject("program_shap_values");
                                Map<String, Double> shapMap = new HashMap<>();
                                Iterator<String> keys = shapObj.keys();
                                while (keys.hasNext()) {
                                    String key = keys.next();
                                    shapMap.put(key, shapObj.getDouble(key));
                                }
                                student.setProgramShapValues(shapMap);
                            } else {
                                student.setProgramShapValues(null);
                            }
                        } else {
                            student.setRecommendedProgram(null);
                            student.setProgramConfidence(0.0);
                            student.setProgramShapValues(null);
                        }

                        // Parse SHAP Map
                        if (obj.has("admission_shap_values")) {
                            JSONObject shapObj = obj.getJSONObject("admission_shap_values");
                            Map<String, Double> shapMap = new HashMap<>();
                            Iterator<String> keys = shapObj.keys();
                            while (keys.hasNext()) {
                                String key = keys.next();
                                shapMap.put(key, shapObj.getDouble(key));
                            }
                            student.setAdmissionShapValues(shapMap);
                        }
                        break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            showAlert("JSON Error", "Failed to parse prediction output from Python script.");
        }
    }

    private void showAlert(String title, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }
}
