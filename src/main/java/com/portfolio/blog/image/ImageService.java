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
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
@Slf4j
public class ImageService {
    private static final Pattern FILE_NAME = Pattern.compile("^[0-9a-f-]{36}\\.(png|jpg|gif|webp)$");
    private final Path uploadDir;
    private final ArticleRepository articleRepository;

    public ImageService(@Value("${upload.dir}") String uploadDir, ArticleRepository articleRepository) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.articleRepository = articleRepository;
    }

    private String detectExtension(MultipartFile file) {
        byte[] header;
        try (InputStream in = file.getInputStream()) {
            header = in.readNBytes(12);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        if (startsWith(header, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) return "png";
        if (startsWith(header, 0xFF, 0xD8, 0xFF)) return "jpg";
        if (startsWith(header, 'G', 'I', 'F', '8')) return "gif";
        if (header.length == 12 && startsWith(header, 'R', 'I', 'F', 'F')
                && Arrays.equals(Arrays.copyOfRange(header, 8, 12)
                , new byte[]{'W', 'E', 'B', 'P'})) return "webp";
        throw new BusinessException(ErrorCode.INVALID_IMAGE);
    }

    private boolean startsWith(byte[] data, int... prefix) {
        if (data.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if ((data[i] & 0xFF) != prefix[i]) return false;
        }
        return true;
    }

    public ImageUploadResponse upload(MultipartFile file) {
        String extension = detectExtension(file);
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
        if (!FILE_NAME.matcher(fileName).matches()) {
            throw new BusinessException(ErrorCode.IMAGE_NOT_FOUND);
        }
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
