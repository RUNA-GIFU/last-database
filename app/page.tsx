// frontend/app/page.tsx
'use client'; // クライアントコンポーネントとしてマーク

import Link from 'next/link';
import { Container, Typography, Box, Button } from '@mui/material'; // MUIコンポーネントをインポート

export default function Home() {
  return (
    // MUIのContainerを使ってコンテンツの幅を制限し、中央寄せにする
    // sx プロパティでFlexboxを使って中央揃えと高さを設定 (Tailwindのmin-h-screenなどに相当)
    <Container
      component="main" // semantic HTML for main content
      maxWidth="md" // コンテンツの最大幅をmdサイズに制限
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // 画面いっぱいの高さ
        py: 4, // 上下のパディング (paddingY)
        backgroundColor: 'background.default', // MUIのテーマからの背景色
        color: 'text.primary', // MUIのテーマからの文字色
      }}
    >
      {/* ページタイトル */}
      <Typography
        variant="h3" // h3要素としてレンダリング (HTMLの<h1>に相当するスタイル)
        component="h1" // 実際のHTMLタグはh1にする
        align="center" // テキスト中央寄せ
        gutterBottom // 下に余白 (marginBottom)
        sx={{
          color: 'primary.dark', // MUIのプライマリカラーの濃い色
          fontWeight: 'bold',
          mb: 5, // 下マージンを調整
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // レスポンシブなフォントサイズ
        }}
      >
        映画・ドラマ 備忘録
      </Typography>

      {/* 映画とドラマのセクションを並べるコンテナ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // スマホでは縦、その他は横並び
          gap: 4, // 各セクション間の隙間
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center', // 縦方向の中央寄せ
        }}
      >
        {/* 映画セクション */}
        <Box
          sx={{
            flex: 1, // 利用可能なスペースを均等に占める
            minWidth: { xs: '90%', sm: 280 }, // 最小幅設定
            maxWidth: { xs: 'none', sm: 400 }, // 最大幅設定
            backgroundColor: 'background.paper', // MUIのテーマからのカード背景色
            borderRadius: 3, // 角の丸み
            boxShadow: 3, // 影
            p: 4, // パディング
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider', // 区切り線の色
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'secondary.dark', mb: 3 }}>
            映画
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 「記録する」ボタン：映画記録入力ページへリンク */}
            <Button
              component={Link} // Next.jsのLinkコンポーネントとしてレンダリング
              href="/movies/record"
              variant="contained" // 塗りつぶされたボタン
              color="primary" // プライマリカラー
              size="large" // 大きなサイズ
              fullWidth // 幅いっぱいに広げる
              sx={{ py: 1.5 }} // 上下のパディング
            >
              記録する
            </Button>
            {/* 「見る」ボタン：映画リストページへリンク */}
            <Button
              component={Link}
              href="/movies/list"
              variant="outlined" // 枠線のみのボタン
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              見る
            </Button>
          </Box>
        </Box>

        {/* ドラマセクション (映画セクションとほぼ同じ構造) */}
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: '90%', sm: 280 },
            maxWidth: { xs: 'none', sm: 400 },
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: 3,
            p: 4,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'secondary.dark', mb: 3 }}>
            ドラマ
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 「記録する」ボタン：ドラマ記録入力ページへリンク */}
            <Button
              component={Link}
              href="/dramas/record"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              記録する
            </Button>
            {/* 「見る」ボタン：ドラマリストページへリンク */}
            <Button
              component={Link}
              href="/dramas/list"
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              見る
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}