// frontend/app/movies/record/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Container, Typography, Box, TextField, Button, Rating, CircularProgress, Alert
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// Movieの入力データを管理する型
interface MovieInput {
  title: string;
  genres: string;
  director: string;
  actors: string;
  release_year: string; // number | null だと空文字の扱いに手間取るためstringで管理
  country: string;
  watch_method: string;
  watched_date: string;
  impressions: string;
  rating: number | null;
}

export default function MovieRecordPage() {
  const router = useRouter();
  const [movie, setMovie] = useState<MovieInput>({
    title: '',
    genres: '',
    director: '',
    actors: '',
    release_year: '',
    country: '',
    watch_method: '',
    watched_date: '',
    impressions: '',
    rating: 3, // 初期評価
  });
  
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    // 各フィールドをFormDataに追加
    Object.entries(movie).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    if (posterFile) {
      formData.append('movie_poster', posterFile);
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/movies/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || '記録の保存に失敗しました。');
      }

      router.push('/movies/list');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        映画の記録
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField name="title" label="タイトル" value={movie.title} onChange={handleChange} required fullWidth margin="normal" />
        
        <Box {...getRootProps()} sx={{ border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`, borderRadius: 2, p: 4, mt: 2, mb: 2, textAlign: 'center', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          {posterPreview ? <img src={posterPreview} alt="プレビュー" style={{ maxHeight: '200px', maxWidth: '100%' }} /> : <><PhotoCamera sx={{ fontSize: 50, mb: 1 }} /><Typography>ポスター画像をドラッグ＆ドロップ</Typography></>}
        </Box>
        
        <TextField name="genres" label="ジャンル (カンマ区切り)" value={movie.genres} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="director" label="監督" value={movie.director} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="actors" label="俳優 (カンマ区切り)" value={movie.actors} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="release_year" label="公開年" value={movie.release_year} onChange={handleChange} type="number" fullWidth margin="normal" />
        <TextField name="country" label="制作国" value={movie.country} onChange={handleChange} fullWidth margin="normal" />
        
        <TextField name="watched_date" label="視聴日" value={movie.watched_date} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
        <TextField name="watch_method" label="視聴方法" value={movie.watch_method} onChange={handleChange} fullWidth margin="normal" />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
          <Typography component="legend">評価</Typography>
          <Rating name="rating" value={movie.rating} precision={0.5} onChange={(event, newValue) => setMovie(prev => ({...prev, rating: newValue}))} size="large" />
        </Box>
        
        <TextField name="impressions" label="感想" value={movie.impressions} onChange={handleChange} multiline rows={4} fullWidth margin="normal" />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : '記録を保存'}
        </Button>
      </Box>
    </Container>
  );
}