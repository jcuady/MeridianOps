package com.meridianops.config;

import com.meridianops.entity.InventoryItem;
import com.meridianops.entity.Ticket;
import com.meridianops.entity.User;
import com.meridianops.repository.InventoryItemRepository;
import com.meridianops.repository.TicketRepository;
import com.meridianops.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            InventoryItemRepository inventoryItemRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("ops");
                admin.setPasswordHash(passwordEncoder.encode("ops123"));
                admin.setRole("USER");
                userRepository.save(admin);
            }

            if (ticketRepository.count() == 0) {
                Ticket t1 = new Ticket();
                t1.setTitle("Restock warehouse A aisle 3");
                t1.setDescription("Low stock alert on fasteners");
                t1.setStatus("OPEN");
                t1.setPriority("HIGH");
                t1.setAssignee("ops");
                ticketRepository.save(t1);

                Ticket t2 = new Ticket();
                t2.setTitle("Verify inbound shipment #4412");
                t2.setDescription("Match packing list to PO");
                t2.setStatus("IN_PROGRESS");
                t2.setPriority("MEDIUM");
                t2.setAssignee("ops");
                ticketRepository.save(t2);
            }

            if (inventoryItemRepository.count() == 0) {
                InventoryItem i1 = new InventoryItem();
                i1.setSku("SKU-1001");
                i1.setName("M8 Hex Bolt");
                i1.setQuantity(240);
                i1.setLocation("WH-A-03");
                i1.setUnitCost(new BigDecimal("0.18"));
                inventoryItemRepository.save(i1);

                InventoryItem i2 = new InventoryItem();
                i2.setSku("SKU-2044");
                i2.setName("Safety Gloves L");
                i2.setQuantity(80);
                i2.setLocation("WH-B-01");
                i2.setUnitCost(new BigDecimal("3.50"));
                inventoryItemRepository.save(i2);
            }
        };
    }
}
