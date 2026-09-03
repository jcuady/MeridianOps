package com.meridianops.controller;

import com.meridianops.entity.InventoryItem;
import com.meridianops.repository.InventoryItemRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class InventoryGraphQlController {

    private final InventoryItemRepository inventoryItemRepository;

    public InventoryGraphQlController(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @QueryMapping
    public List<InventoryItem> inventoryItems() {
        return inventoryItemRepository.findAll();
    }

    @QueryMapping
    public InventoryItem inventoryItem(@Argument Long id) {
        return inventoryItemRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public InventoryItem inventoryItemBySku(@Argument String sku) {
        return inventoryItemRepository.findBySku(sku).orElse(null);
    }

    @MutationMapping
    public InventoryItem updateInventoryQuantity(@Argument Long id, @Argument Integer quantity) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));
        item.setQuantity(quantity);
        item.setUpdatedAt(LocalDateTime.now());
        return inventoryItemRepository.save(item);
    }

    @SchemaMapping(typeName = "InventoryItem", field = "unitCost")
    public Double unitCost(InventoryItem item) {
        return item.getUnitCost() == null ? null : item.getUnitCost().doubleValue();
    }

    @SchemaMapping(typeName = "InventoryItem", field = "updatedAt")
    public String updatedAt(InventoryItem item) {
        return item.getUpdatedAt() == null ? null : item.getUpdatedAt().toString();
    }
}
