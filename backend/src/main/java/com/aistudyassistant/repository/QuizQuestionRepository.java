package com.aistudyassistant.repository;

import com.aistudyassistant.model.QuizQuestion;
import com.aistudyassistant.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    
    List<QuizQuestion> findByQuizOrderByOrderIndexAsc(Quiz quiz);
}
