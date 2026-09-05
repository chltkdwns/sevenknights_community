package com.sevenknights.community.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EnemyTeamControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/guild-war/attack/enemy-teams"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void listWithUserIsForbidden() throws Exception {
        mockMvc.perform(get("/api/guild-war/attack/enemy-teams"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MEMBER")
    void listWithMemberReturnsOk() throws Exception {
        mockMvc.perform(get("/api/guild-war/attack/enemy-teams"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listWithAdminReturnsOk() throws Exception {
        mockMvc.perform(get("/api/guild-war/attack/enemy-teams"))
                .andExpect(status().isOk());
    }
}
