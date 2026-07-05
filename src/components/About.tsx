const tags = ['绘画创作者', '明星同人厚涂', '数字肖像', '个人视觉档案', '定制约稿'];

const stats = [
  '80% 明星同人厚涂',
  '持续更新中',
  '支持定制约稿',
  '个人视觉档案',
];

function About() {
  return (
    <section className="section about-section scroll-reveal" id="about" aria-labelledby="about-title">
      <div className="container about-layout">
        <div className="about-portrait" aria-label="创作者头像占位">
          <span>o 泡</span>
        </div>
        <div className="about-copy">
          <p className="section-label">About</p>
          <h2 id="about-title">关于创作者</h2>
          <p>
            我是一名绘画创作者，主要创作明星同人厚涂与数字肖像作品。这个网站用于整理我的阶段性作品、创作风格与可参考的约稿方向。
          </p>
          <div className="tag-cloud">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mini-stats">
            {stats.map((stat) => (
              <strong key={stat}>{stat}</strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
