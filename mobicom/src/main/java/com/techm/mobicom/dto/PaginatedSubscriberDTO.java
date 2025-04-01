package com.techm.mobicom.dto;

import java.util.List;

public class PaginatedSubscriberDTO {
    
    private List<CurrentPlanDetailsDTO> subscribers;
    private int currentPage;
    private int totalPages;
    private long totalSubscribers;

    // Getters and Setters
    public List<CurrentPlanDetailsDTO> getSubscribers() {
        return subscribers;
    }

    public void setSubscribers(List<CurrentPlanDetailsDTO> subscribers) {
        this.subscribers = subscribers;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalSubscribers() {
        return totalSubscribers;
    }

    public void setTotalSubscribers(long totalSubscribers) {
        this.totalSubscribers = totalSubscribers;
    }
}