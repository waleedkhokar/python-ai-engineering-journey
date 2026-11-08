package com.admissionxai.util;

import com.admissionxai.model.Student;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {

    public static List<Student> readStudentsFromCSV(String filePath) {
        List<Student> students = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line = br.readLine();
            String[] headers = line != null ? line.split(",") : new String[0];
            List<String> headerList = new ArrayList<>();
            for (String h : headers) {
                headerList.add(h.trim());
            }

            String[] requiredColumns = {
                "student_id", "name", "physics_marks", "chemistry_marks", "biology_marks",
                "computer_science_marks", "math_marks", "english_marks", "entrance_test_score",
                "extracurriculars", "documents_complete"
            };

            List<String> missingColumns = new ArrayList<>();
            for (String req : requiredColumns) {
                if (!headerList.contains(req)) {
                    missingColumns.add(req);
                }
            }

            if (!missingColumns.isEmpty()) {
                throw new IllegalArgumentException("Missing required column(s): " + String.join(", ", missingColumns));
            }

            while ((line = br.readLine()) != null) {

                String[] data = line.split(",");
                if (data.length < 11) continue;

                String studentId = data[0].trim();
                String name = data[1].trim();
                double physics = Double.parseDouble(data[2].trim());
                double chemistry = Double.parseDouble(data[3].trim());
                double biology = Double.parseDouble(data[4].trim());
                double cs = Double.parseDouble(data[5].trim());
                double math = Double.parseDouble(data[6].trim());
                double english = Double.parseDouble(data[7].trim());
                int testScore = Integer.parseInt(data[8].trim());
                int extracurriculars = Integer.parseInt(data[9].trim());
                boolean docsComplete = Boolean.parseBoolean(data[10].trim()) || "1".equals(data[10].trim());

                String docStatus = docsComplete ? "Complete" : "Missing Doc";
                String readyStatus = docsComplete ? "Ready" : "Pending";

                Student student = new Student(
                    studentId, name, physics, chemistry, biology, cs, math, english,
                    testScore, extracurriculars, docsComplete, docStatus, readyStatus
                );

                students.add(student);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return students;
    }
}
