# Works placeholders

作品数据先指向 `public/works/*.jpg`。把真实图片放到这个目录，并保持文件名一致即可替换占位视觉。

首页最重要的 3 张图：

- `nocturne-portrait.jpg`：首页右侧主图，也是首屏最大视觉。
- `velvet-profile.jpg`：首页右侧下方小作品之一。
- `green-room-study.jpg`：首页右侧下方小作品之一。

如果想做出参考图那种“人物压住色块”的感觉，首页主图建议使用：

- 竖版头像 / 半身图。
- 主体清晰、背景不要太花。
- 如果会抠图，可以用透明背景 PNG，并在 `src/data/works.ts` 里把文件名从 `.jpg` 改成 `.png`。
- 如果图片是横图或方图，请在 `src/data/works.ts` 里把对应作品的 `orientation` 改成 `landscape` 或 `square`。

其他作品位：

- `brass-light.jpg`
- `soft-editorial.jpg`
- `moonlit-face.jpg`
- `archive-sketch-01.jpg`
- `paired-frame.jpg`
- `red-curtain.jpg`
- `paper-study.jpg`
