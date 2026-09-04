package com.sevenknights.community.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EnemyTeamAdminControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/admin/guild-war/attack/enemy-teams"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listWithAdminReturnsOk() throws Exception {
        mockMvc.perform(get("/api/admin/guild-war/attack/enemy-teams"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void reorderWithEmptyIdsReturnsBadRequestNotUnauthorized() throws Exception {
        mockMvc.perform(put("/api/admin/guild-war/attack/enemy-teams/reorder")
                        .contentType("application/json")
                        .content("{\"orderedIds\":[]}"))
                .andExpect(status().isBadRequest());
    }
}
