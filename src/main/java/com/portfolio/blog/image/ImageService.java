package com.portfolio.blog.image;

import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import com.portfolio.blog.image.dto.ImageUploadResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ImageService {
    private final Path uploadDir;

    public ImageService(@Value("${upload.dir}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public ImageUploadResponse upload(MultipartFile file) {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + extension;
        try {
            Files.createDirectories(uploadDir);
            file.transferTo(uploadDir.resolve(fileName));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        return new ImageUploadResponse("/api/images/" + fileName);
    }

    public Resource load(String fileName) {
        Path path = uploadDir.resolve(fileName);
        if (!Files.exists(path)) {
            throw new BusinessException(ErrorCode.IMAGE_NOT_FOUND);
        }
        return new FileSystemResource(path);
    }
}
