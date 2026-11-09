package com.portfolio.blog.auth;

import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!needsLogin(request)) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if(session == null || session.getAttribute("loginId") == null){
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return true;
    }

    private boolean needsLogin(HttpServletRequest request) {
        String method = request.getMethod();
        boolean isWrite = method.equals("POST") || method.equals("PUT") || method.equals("DELETE");
        return isWrite || request.getServletPath().endsWith("/deletion-preview");
    }
}