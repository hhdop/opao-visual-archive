const commissionNotes = [
  '约稿入口暂时作为风格参考保留，正式价格与排期后续再开放。',
  '明星同人类作品以个人收藏、头像与社交平台展示为主。',
  '如果想参考某张作品的笔触、色调或构图，可以先通过联系方式说明方向。',
];

function Commission() {
  return (
    <section className="section commission-section compact-commission scroll-reveal" id="commission" aria-labelledby="commission-title">
      <div className="container">
        <div className="commission-hold">
          <div>
            <p className="section-label">Commission / Reserved</p>
            <h2 id="commission-title">约稿入口暂存</h2>
          </div>
          <div className="commission-hold-copy">
            <p>
              这一栏先不做完整价格表。当前网站以作品归档、原图领取与风格展示为主，约稿信息只保留一个安静的咨询位置。
            </p>
            <ul>
              {commissionNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <a className="button button-line" href="#contact">
              查看联系方式
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Commission;
