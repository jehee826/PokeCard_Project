<<<<<<< HEAD
package com.example.back.DTO;


import lombok.Getter;


@Getter
public class AuthResponse {
    private String token;
    private String message;
    private String userNumber; // 임의로 할당해 본 변수

    public AuthResponse(String token, String message, String userNumber) {
        this.token = token;
        this.message = message;
        this.userNumber = userNumber;
    }

    // Getter 추가 (React에서 JSON으로 읽기 위해 필수)
    public String getToken() { return token; }
    public String getMessage() { return message; }
    public String getUserNumber() { return userNumber; }
=======
package com.example.back.DTO;


import lombok.Getter;


@Getter
public class AuthResponse {
    private String token;
    private String message;
    private String userNumber; // 임의로 할당해 본 변수

    public AuthResponse(String token, String message, String userNumber) {
        this.token = token;
        this.message = message;
        this.userNumber = userNumber;
    }

    // Getter 추가 (React에서 JSON으로 읽기 위해 필수)
    public String getToken() { return token; }
    public String getMessage() { return message; }
    public String getUserNumber() { return userNumber; }
>>>>>>> cc00384a07fea4897bf0948befbba65d70e67bb0
}