package com.portfolio.blog.image;

import com.portfolio.blog.image.dto.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ImageUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return imageService.upload(file);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> find(@PathVariable String fileName) {
        Resource image = imageService.load(fileName);
        MediaType type = MediaTypeFactory.getMediaType(fileName)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok().contentType(type)
                .header("X-Content-Type-Options", "nosniff").body(image);
    }
}
