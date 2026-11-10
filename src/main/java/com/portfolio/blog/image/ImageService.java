package com.portfolio.blog.image;

import com.portfolio.blog.article.ArticleRepository;
import com.portfolio.blog.global.error.BusinessException;
import com.portfolio.blog.global.error.ErrorCode;
import com.portfolio.blog.image.dto.ImageUploadResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@Slf4j
public class ImageService {
    private final Path uploadDir;
    private final ArticleRepository articleRepository;

    public ImageService(@Value("${upload.dir}") String uploadDir, ArticleRepository articleRepository) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.articleRepository = articleRepository;
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

    @Scheduled(cron = "${image.cleanup.cron:0 0 4 * * *}")
    public void deleteUnusedImages() {
        if (!Files.exists(uploadDir)) return;
        Instant limit = Instant.now().minus(Duration.ofHours(24));

        List<Path> files;
        try (Stream<Path> stream = Files.list(uploadDir)) {
            files = stream.toList();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }

        int deleted = 0;
        for (Path file : files) {
            String fileName = file.getFileName().toString();
            try {
                if (Files.getLastModifiedTime(file).toInstant().isAfter(limit)) continue;
                if (articleRepository.existsByContentContainingOrThumbnailUrlContaining(fileName, fileName)) continue;
                Files.delete(file);
                deleted++;
            } catch (IOException e) {
                log.warn("이미지 정리 실패: {}", fileName, e);
            }
        }
        log.info("사용하지 않는 이미지 {}개 삭제", deleted);
    }
}
