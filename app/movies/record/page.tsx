'use client';

import { useState, useEffect } from 'react'; // useEffect をインポート
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container, Typography, Box, TextField, Button, Rating, Alert, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// Movieインターフェースは変更なし
interface Movie {
  movie_id?: string;
  title: string;
  genres: string;
  director: string;
  actors: string;
  release_year: number | null;
  country: string;
  movie_poster_url: string;
  rating: number | null;
  impressions: string;
  watch_method: string;
}

export default function MovieRecordPage() {
  const [movie, setMovie] = useState<Movie>({
    title: '',
    genres: '',
    director: '',
    actors: '',
    release_year: null,
    country: '',
    movie_poster_url: '',
    rating: null,
    impressions: '',
    watch_method: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 変更点 1: クライアントサイドでのみ現在の年を取得する
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされた後（クライアントサイド）で年を設定
    setCurrentYear(new Date().getFullYear());
  }, []);


  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie((prev) => ({
      ...prev,
      [name]: name === 'release_year' ? (value ? Number(value) : null) : value,
    }));
  };

  const handleRatingChange = (event: React.SyntheticEvent, newRating: number | null) => {
    setMovie((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/movies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });

      if (!response.ok) {
  // サーバーからの応答を、形式を問わずそのままテキストとして受け取る
  const errorText = await response.text(); 
  // 受け取ったテキストをそのままエラーメッセージとして表示する
  throw new Error(errorText || 'サーバーからエラー応答がありました');
}

      setSuccess(true);
      setMovie({
        title: '',
        genres: '',
        director: '',
        actors: '',
        release_year: null,
        country: '',
        movie_poster_url: '',
        rating: null,
        impressions: '',
        watch_method: '',
      });
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.dark', fontWeight: 'bold' }}>
        映画を記録する
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <TextField label="タイトル" variant="outlined" fullWidth required margin="normal" name="title" value={movie.title} onChange={handleChange} />
        <TextField label="ポスター画像URL (任意)" variant="outlined" fullWidth margin="normal" name="movie_poster_url" value={movie.movie_poster_url} onChange={handleChange} type="url" />

        {movie.movie_poster_url && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img src={movie.movie_poster_url} alt="ポスタープレビュー" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          </Box>
        )}

        <TextField label="ジャンル (カンマ区切り)" variant="outlined" fullWidth margin="normal" name="genres" value={movie.genres} onChange={handleChange} />
        <TextField label="監督" variant="outlined" fullWidth margin="normal" name="director" value={movie.director} onChange={handleChange} />
        <TextField label="俳優 (カンマ区切り)" variant="outlined" fullWidth margin="normal" name="actors" value={movie.actors} onChange={handleChange} />
        
        {/* 変更点 2: currentYearがセットされた後でのみTextFieldを描画 */}
        {currentYear && (
            <TextField label="公開年" variant="outlined" fullWidth margin="normal" name="release_year" value={movie.release_year === null ? '' : movie.release_year} onChange={handleChange} type="number" inputProps={{ min: 1888, max: currentYear }} />
        )}

        <TextField label="制作国" variant="outlined" fullWidth margin="normal" name="country" value={movie.country} onChange={handleChange} />

        {/* 変更点 3: Boxをfieldsetに変更し、Typographyをlegendとして正しく使用 */}
        <Box component="fieldset" sx={{ mt: 2, border: 'none', p: 0 }}>
          <Typography component="legend" sx={{ mb: 1 }}>評価</Typography>
          <Rating name="rating" value={movie.rating} onChange={handleRatingChange} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
        </Box>

        <TextField label="感想" variant="outlined" fullWidth margin="normal" name="impressions" value={movie.impressions} onChange={handleChange} multiline rows={4} />
        <TextField label="視聴方法" variant="outlined" fullWidth margin="normal" name="watch_method" value={movie.watch_method} onChange={handleChange} />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>映画の記録が完了しました！</Alert>}

        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading} sx={{ mt: 3, py: 1.5 }}>
          {isLoading ? '記録中...' : '記録を保存'}
        </Button>
      </Box>

      <Link href="/" passHref>
        <Button variant="text" sx={{ mt: 3 }}>
          トップページに戻る
        </Button>
      </Link>
    </Container>
  );
}