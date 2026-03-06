import javax.swing.*;
import java.awt.*;

public class LibraryGUI extends JFrame {

    public LibraryGUI() {
        setTitle("Library Management System");
        setSize(600,400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create tab system
        JTabbedPane tabbedPane = new JTabbedPane();

        // Search Books Tab
        JPanel searchPanel = new JPanel();
        searchPanel.add(new JLabel("Search Books"));
        searchPanel.add(new JTextField(20));
        searchPanel.add(new JButton("Search"));
        tabbedPane.addTab("Search", searchPanel);

        // Borrow Books Tab
        JPanel borrowPanel = new JPanel();
        borrowPanel.add(new JLabel("Borrow Book"));
        borrowPanel.add(new JButton("Borrow"));
        tabbedPane.addTab("Borrow", borrowPanel);

        // Return Books Tab
        JPanel returnPanel = new JPanel();
        returnPanel.add(new JLabel("Return Book"));
        returnPanel.add(new JButton("Return"));
        tabbedPane.addTab("Return", returnPanel);

        // Admin Tab
        JPanel adminPanel = new JPanel();
        adminPanel.add(new JLabel("Admin Panel"));
        adminPanel.add(new JButton("Add Book"));
        adminPanel.add(new JButton("Remove Book"));
        tabbedPane.addTab("Admin", adminPanel);

        add(tabbedPane);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            LibraryGUI gui = new LibraryGUI();
            gui.setVisible(true);
        });
    }
}