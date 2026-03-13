package com.libratech.service;

import com.libratech.model.Book;
import com.libratech.repository.BookRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.Id;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService{

    private final BookRepository repo;

    public BookService(BookRepository repo){
        this.repo = repo;
    }
    @PostConstruct
    public void loadBooks() {
        if (repo.count() == 0) {
            repo.save(new Book("The Great Gatsby", "F. Scott Fitzgerald", "Classic"));
            repo.save(new Book("To Kill a Mockingbird", "Harper Lee", "Fiction"));
            repo.save(new Book("1984", "George Orwell", "Dystopian"));
            repo.save(new Book("The Hobbit", "J.R.R. Tolkien", "Fantasy"));
            repo.save(new Book("Pride and Prejudice", "Jane Austen", "Romance"));
        }
    }

    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return repo.findAll();
        }

        return repo.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword);
    }
}