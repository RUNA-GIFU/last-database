// frontend/app/movies/list/page.tsx
'use client'; // クライアントコンポーネントとしてマーク

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.jsのImageコンポーネント
import {
  Container, Typography, Box, Card, CardContent, CardMedia, Button, Rating, Alert
} from '@mui/material'; // MUIコンポーネントをインポート (Gridは削除)
import StarIcon from '@mui/icons-material/Star'; // MUIの星アイコン

// ★モックデータ用の型定義 (プロジェクト全体で共有する types/index.ts などに移動するのが理想)
interface Movie {
  movie_id: string;
  title: string;
  movie_poster_url: string;
  rating: number | null;
  watched_date: string;
  impressions: string;
}

// ★仮のモックデータ（後でバックエンドから取得するデータに置き換える）
const mockMovies: Movie[] = [
  {
    movie_id: 'mov001',
    title: '宇宙の旅 2025',
    movie_poster_url: 'input.jpg', // 仮のURL
    rating: 5,
    watched_date: '2025-06-01',
    impressions: '壮大なSF体験だった。映像美に圧倒された。',
  },
  {
    movie_id: 'mov002',
    title: '探偵の休日',
    movie_poster_url: 'input.jpg', // 仮のURL
    rating: 4,
    watched_date: '2025-06-15',
    impressions: '意外な展開で面白かった。登場人物も魅力的。',
  },
  {
    movie_id: 'mov003',
    title: '猫と私と世界の終わり',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/oE8E8TjN.jpg', // 仮のURL
    rating: null, // 未評価
    watched_date: '2025-06-20',
    impressions: '考えさせられる内容だった。少し悲しい。',
  },
  {
    movie_id: 'mov004',
    title: '未来都市の夢',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/pO3zX9z.jpg', // 仮のURL
    rating: 3,
    watched_date: '2025-07-01',
    impressions: '想像していたよりは普通だったが、楽しめた。',
  },
  {
    movie_id: 'mov005',
    title: '静かなる森の伝説',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/pQRxJzQ.jpg', // 仮のURL
    rating: 4.5, // 半星評価のデモ用
    watched_date: '2025-07-05',
    impressions: '映像と音楽が美しかった。',
  },
  {
    movie_id: 'mov006',
    title: '闇を照らす灯台',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/gV9yJqR.jpg', // 仮のURL
    rating: 2,
    watched_date: '2025-07-07',
    impressions: '少し退屈だったが、メッセージ性はあった。',
  },
];

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ★本来はここでバックエンドAPIを呼び出してデータを取得する
    // 現時点ではモックデータをセット
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 例: const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`);
        // const data = await response.json();
        // setMovies(data);

        // モックデータを使用
        setTimeout(() => { // API呼び出しの遅延をシミュレート
          setMovies(mockMovies);
          setIsLoading(false);
        }, 500); // 0.5秒の遅延
      } catch (err: any) {
        setError(err.message || '映画データの読み込みに失敗しました。');
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []); // []で一度だけ実行

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">映画データを読み込み中...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">エラー: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.dark', fontWeight: 'bold' }}>
        映画リスト
      </Typography>

      {/* 新規追加ボタン */}
      <Button
        component={Link}
        href="/movies/record"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mb: 4 }}
        passHref
      >
        新しい映画を記録する
      </Button>

      {movies.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            まだ記録された映画がありません。
          </Typography>
        </Box>
      ) : (
        // ★ここを修正: Gridコンテナの代わりにBoxを使用し、CSS Gridでレイアウト
        <Box
          sx={{
            display: 'grid',
            // レスポンシブなグリッドカラム定義
              gridTemplateColumns: {
              xs: 'repeat(1, 1fr)', // スマホ: 1列
              sm: 'repeat(2, 1fr)', // タブレット縦: 2列
              md: 'repeat(3, 1fr)', // タブレット横: 3列
              lg: 'repeat(4, 1fr)', // PC: 4列
            },
            gap: 3, // グリッドアイテム間の隙間
            width: '100%',
            maxWidth: 'lg', // ContainerのmaxWidthと合わせる
            justifyContent: 'center', // 中央寄せ
          }}
        >
          {movies.map((movie) => (
            // ★ここを修正: Grid itemの代わりにBoxを使用
            <Box key={movie.movie_id} sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* 各映画のカードをLinkで囲み、詳細ページへ遷移できるようにする */}
              <Link href={`/movies/${movie.movie_id}`} passHref style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
                    width: '100%', // Boxの子として幅いっぱいに
                    maxWidth: 250, // カードの最大幅（任意で調整）
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.02)',
                      transition: 'all 0.3s ease-in-out',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component={Image}
                    src={movie.movie_poster_url || '/placeholder_movie.jpg'}
                    alt={movie.title}
                    width={200} // Imageコンポーネントのwidth/heightは必須
                    height={300}
                    priority
                    loading="eager"
                    sx={{
                      height: 300,
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      視聴日: {movie.watched_date}
                    </Typography>
                    {movie.rating !== null && (
                      <Rating
                        name={`movie-rating-${movie.movie_id}`}
                        value={movie.rating}
                        precision={0.5}
                        readOnly
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                    )}
                  </CardContent>
                </Card>
              </Link>
            </Box>
          ))}
        </Box>
      )}

      {/* トップページへの戻るボタン */}
      <Link href="/" passHref>
        <Button variant="text" sx={{ mt: 5 }}>
          トップページに戻る
        </Button>
      </Link>
    </Container>
  );
}