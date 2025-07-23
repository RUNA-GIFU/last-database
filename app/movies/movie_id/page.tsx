// frontend/app/movies/[movie_id]/page.tsx
'use client'; // クライアントコンポーネントとしてマーク

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // URLパラメータとルーティング用
import Link from 'next/link';
import Image from 'next/image'; // Next.jsのImageコンポーネント
import {
  Container, Typography, Box, TextField, Button, Rating, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material'; // MUIコンポーネントをインポート
import StarIcon from '@mui/icons-material/Star'; // MUIの星アイコン

// ★モックデータ用の型定義 (プロジェクト全体で共有する types/index.ts などに移動するのが理想)
interface Movie {
  movie_id: string;
  title: string;
  genres: string;
  director: string;
  actors: string;
  release_year: number | null;
  country: string;
  movie_poster_url: string;
  rating: number | null;
  impressions: string;
  watched_date: string;
  watch_method: string;
  created_at?: string; // DBから取得する項目
  updated_at?: string; // DBから取得する項目
}

// ★仮のモックデータ（映画リストページと同じものを再利用）
const mockMovies: Movie[] = [
  {
    movie_id: 'mov001',
    title: '宇宙の旅 2025',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/ApeE4F0wJ9l.jpg',
    rating: 5,
    watched_date: '2025-06-01',
    impressions: '壮大なSF体験だった。映像美に圧倒された。',
    genres: 'SF, アドベンチャー', director: 'ジョン・スミス', actors: 'アリス, ボブ', release_year: 2025, country: 'アメリカ', watch_method: '映画館'
  },
  {
    movie_id: 'mov002',
    title: '探偵の休日',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/nN4xGj0bH.jpg',
    rating: 4,
    watched_date: '2025-06-15',
    impressions: '意外な展開で面白かった。登場人物も魅力的。',
    genres: 'ミステリー, コメディ', director: 'ジェーン・ドウ', actors: 'チャーリー, デイジー', release_year: 2024, country: 'イギリス', watch_method: 'Netflix'
  },
  {
    movie_id: 'mov003',
    title: '猫と私と世界の終わり',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/oE8E8TjN.jpg',
    rating: null,
    watched_date: '2025-06-20',
    impressions: '考えさせられる内容だった。少し悲しい。',
    genres: 'ドラマ', director: 'アキラ・タナカ', actors: 'エミリー', release_year: 2023, country: '日本', watch_method: 'Prime Video'
  },
  {
    movie_id: 'mov004',
    title: '未来都市の夢',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/pO3zX9z.jpg',
    rating: 3,
    watched_date: '2025-07-01',
    impressions: '想像していたよりは普通だったが、楽しめた。',
    genres: 'SF, アクション', director: 'マイク・ブラウン', actors: 'フランク, グレース', release_year: 2022, country: 'ドイツ', watch_method: 'DVD'
  },
  {
    movie_id: 'mov005',
    title: '静かなる森の伝説',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/pQRxJzQ.jpg',
    rating: 4.5,
    watched_date: '2025-07-05',
    impressions: '映像と音楽が美しかった。',
    genres: 'ファンタジー', director: 'ソフィア・グリーン', actors: 'ハリー', release_year: 2024, country: 'カナダ', watch_method: 'Hulu'
  },
  {
    movie_id: 'mov006',
    title: '闇を照らす灯台',
    movie_poster_url: 'https://image.tmdb.org/t/p/w500/gV9yJqR.jpg',
    rating: 2,
    watched_date: '2025-07-07',
    impressions: '少し退屈だったが、メッセージ性はあった。',
    genres: 'スリラー', director: 'オリバー・ホワイト', actors: 'アイザック', release_year: 2023, country: 'フランス', watch_method: '映画館'
  },
];


export default function MovieDetailPage() {
  const params = useParams(); // URLパラメータを取得
  const router = useRouter(); // ルーターフック
  const movieId = params.movie_id as string; // URLから映画IDを取得

  const [movie, setMovie] = useState<Movie | null>(null);
  const [editMovie, setEditMovie] = useState<Movie | null>(null); // 編集用の一時データ
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうかのフラグ
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 削除確認ダイアログ

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ★本来はここでバックエンドAPIを呼び出してデータを取得する
        // 例: const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${movieId}`);
        // const data = await response.json();
        // setMovie(data);
        // setEditMovie(data); // 編集用データも初期化

        // モックデータからIDで映画を検索
        const foundMovie = mockMovies.find(m => m.movie_id === movieId);
        if (foundMovie) {
          setMovie(foundMovie);
          setEditMovie(foundMovie); // 編集用データも初期化
        } else {
          setError('指定された映画が見つかりません。');
        }
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || '映画データの読み込みに失敗しました。');
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]); // movieIdが変更されたら再実行

  // 編集モードでの入力値変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditMovie((prevEditMovie) => {
      if (!prevEditMovie) return null;
      return {
        ...prevEditMovie,
        [name]: name === 'release_year' ? (value ? Number(value) : null) : value,
      };
    });
  };

  // 評価の星をクリックしたときのハンドラー (編集モード用)
  const handleRatingChange = (event: React.SyntheticEvent, newRating: number | null) => {
    setEditMovie((prevEditMovie) => {
      if (!prevEditMovie) return null;
      return {
        ...prevEditMovie,
        rating: newRating,
      };
    });
  };

  // 編集モード切り替え
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // 編集キャンセル時は元のデータに戻す
    if (isEditing) {
      setEditMovie(movie);
      setError(null); // エラーメッセージもリセット
    }
  };

  // データの保存（更新）
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editMovie) return;

    setIsLoading(true);
    setError(null);
    try {
      // ★★★ ここでPythonバックエンドAPIを呼び出してデータを更新します ★★★
      // 例: const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      // const response = await fetch(`${backendUrl}/api/movies/${movieId}`, {
      //   method: 'PUT', // 更新はPUTメソッド
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editMovie),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '映画の更新に失敗しました');
      // }

      // モックデータの更新をシミュレート (実際にはDBを更新)
      console.log('映画データを更新:', editMovie);
      setMovie(editMovie); // 表示データも更新
      setIsEditing(false); // 編集モード終了
      alert('映画情報が更新されました！'); // 簡易的な成功メッセージ
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 削除確認ダイアログを開く
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  // 削除確認ダイアログを閉じる
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // データの削除
  const handleDelete = async () => {
    handleDeleteDialogClose(); // ダイアログを閉じる
    setIsLoading(true);
    setError(null);
    try {
      // ★★★ ここでPythonバックエンドAPIを呼び出してデータを削除します ★★★
      // 例: const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      // const response = await fetch(`${backendUrl}/api/movies/${movieId}`, {
      //   method: 'DELETE',
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '映画の削除に失敗しました');
      // }

      // モックデータの削除をシミュレート (実際にはDBを削除)
      console.log('映画データを削除:', movieId);
      alert('映画が削除されました。'); // 簡易的な成功メッセージ
      router.push('/movies/list'); // 削除後リストページへリダイレクト
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ mt: 5 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>データを読み込み中...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Link href="/movies/list" passHref>
          <Button variant="text" sx={{ mt: 3 }}>
            リストに戻る
          </Button>
        </Link>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
          映画情報が見つかりませんでした。
        </Typography>
        <Link href="/movies/list" passHref>
          <Button variant="text" sx={{ mt: 3 }}>
            リストに戻る
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.dark', fontWeight: 'bold' }}>
        {isEditing ? '映画情報を編集' : movie.title}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 500, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        {isEditing ? (
          // 編集モードのフォーム
          <Box component="form" onSubmit={handleSave}>
            <TextField
              label="タイトル"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="title"
              value={editMovie?.title || ''}
              onChange={handleChange}
            />
            <TextField
              label="ポスター画像URL (任意)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="movie_poster_url"
              value={editMovie?.movie_poster_url || ''}
              onChange={handleChange}
              type="url"
            />
            {editMovie?.movie_poster_url && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={editMovie.movie_poster_url} alt="ポスタープレビュー" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              </Box>
            )}
            <TextField
              label="ジャンル (カンマ区切り)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="genres"
              value={editMovie?.genres || ''}
              onChange={handleChange}
            />
            <TextField
              label="監督"
              variant="outlined"
              fullWidth
              margin="normal"
              name="director"
              value={editMovie?.director || ''}
              onChange={handleChange}
            />
            <TextField
              label="俳優 (カンマ区切り)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="actors"
              value={editMovie?.actors || ''}
              onChange={handleChange}
            />
            <TextField
              label="公開年"
              variant="outlined"
              fullWidth
              margin="normal"
              name="release_year"
              value={editMovie?.release_year === null ? '' : editMovie?.release_year || ''}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1888, max: new Date().getFullYear() }}
            />
            <TextField
              label="制作国"
              variant="outlined"
              fullWidth
              margin="normal"
              name="country"
              value={editMovie?.country || ''}
              onChange={handleChange}
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography component="legend" sx={{ mr: 2 }}>評価</Typography>
              <Rating
                name="rating"
                value={editMovie?.rating}
                onChange={handleRatingChange}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </Box>
            <TextField
              label="感想"
              variant="outlined"
              fullWidth
              margin="normal"
              name="impressions"
              value={editMovie?.impressions || ''}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <TextField
              label="視聴日"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="watched_date"
              value={editMovie?.watched_date || ''}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="視聴方法"
              variant="outlined"
              fullWidth
              margin="normal"
              name="watch_method"
              value={editMovie?.watch_method || ''}
              onChange={handleChange}
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleEditToggle} disabled={isLoading}>
                キャンセル
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </Box>
          </Box>
        ) : (
          // 表示モードの詳細
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Image
                src={movie.movie_poster_url || '/placeholder_movie.jpg'}
                alt={movie.title}
                width={200}
                height={300}
                priority
                loading="eager"
                style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              />
            </Box>

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              タイトル: {movie.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              ジャンル: {movie.genres || '未設定'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              監督: {movie.director || '未設定'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              俳優: {movie.actors || '未設定'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              公開年: {movie.release_year || '未設定'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              制作国: {movie.country || '未設定'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>評価:</Typography>
              {movie.rating !== null ? (
                <Rating
                  name="read-only-rating"
                  value={movie.rating}
                  precision={0.5}
                  readOnly
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">未評価</Typography>
              )}
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              感想: {movie.impressions || 'なし'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              視聴日: {movie.watched_date}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              視聴方法: {movie.watch_method || '未設定'}
            </Typography>
            {movie.created_at && (
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                作成日時: {new Date(movie.created_at).toLocaleString()}
              </Typography>
            )}
            {movie.updated_at && (
              <Typography variant="caption" display="block" color="text.secondary">
                最終更新日時: {new Date(movie.updated_at).toLocaleString()}
              </Typography>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary" onClick={handleEditToggle}>
                編集
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteDialogOpen}>
                削除
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* リストに戻るボタン */}
      <Link href="/movies/list" passHref>
        <Button variant="text" sx={{ mt: 3 }}>
          映画リストに戻る
        </Button>
      </Link>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"映画を削除しますか？"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            この映画の記録を完全に削除します。この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus disabled={isLoading}>
            {isLoading ? '削除中...' : '削除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}