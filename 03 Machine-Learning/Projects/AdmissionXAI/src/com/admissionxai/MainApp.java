package com.admissionxai;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainApp extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        java.net.URL fxmlLocation = getClass().getResource("/com/admissionxai/view/main.fxml");

        if (fxmlLocation == null) {
            throw new RuntimeException("Could not find main.fxml in /com/admissionxai/view/");
        }

        FXMLLoader loader = new FXMLLoader(fxmlLocation);
        Parent root = loader.load();

        // Let the Scene size come from main.fxml's prefWidth/prefHeight
        // instead of hardcoding a conflicting size here.
        Scene scene = new Scene(root);

        java.net.URL cssLocation = getClass().getResource("/com/admissionxai/view/styles.css");
        if (cssLocation != null) {
            scene.getStylesheets().add(cssLocation.toExternalForm());
        }

        primaryStage.setTitle("AdmissionXAI - Decision Engine");
        primaryStage.setScene(scene);
        primaryStage.setMinWidth(860);
        primaryStage.setMinHeight(520);
        // No max height/width cap - let the user resize or maximize freely.
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}