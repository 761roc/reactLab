import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '核心矛盾', value: '既要方便定位线上问题，又不能把源码直接暴露给所有人' },
  { label: '关键做法', value: '上传到监控平台、和版本绑定、服务端受控存储' },
  { label: '高频风险', value: '公网可访问 sourcemap、版本对不上、清理策略缺失' },
  { label: '答题重点', value: '调试便利和安全边界要一起讲' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 线上 sourcemap 管理的核心，不是“要不要开”，而是“怎么受控使用”',
    paragraphs: [
      'sourcemap 的价值很明显：把压缩混淆后的堆栈映射回源码，方便定位线上问题。但它的风险也很直接：如果 sourcemap 暴露在公网，基本等于把源码结构、文件路径甚至部分实现细节直接给出去了。',
      '所以这道题的关键不是选一边，而是讲清楚：如何既保留排障能力，又把访问权收紧在内部可控范围内。',
      '如果开头先把这对矛盾说出来，后面的管理策略就有了主线。',
    ],
  },
  {
    title: '2. 最稳的实践通常是：构建时生成 sourcemap，但不公开暴露给所有用户',
    paragraphs: [
      '比较常见的做法是在 CI 构建时生成 sourcemap，然后在发布时把它上传到 Sentry 等监控平台，或者上传到企业内部受控对象存储，再与版本号绑定。',
      '这样线上报错发生时，监控平台可以基于 release / build id 去解析堆栈，但普通用户和浏览器请求并不能直接访问 sourcemap 文件。',
      '因此最关键的一点是：生成 sourcemap 不等于公开 sourcemap。',
    ],
  },
  {
    title: '3. sourcemap 管理一定要和发布版本强绑定',
    paragraphs: [
      '如果 sourcemap 和当前线上代码版本对不上，解析出来的堆栈很可能是错的。所以正确做法通常是：每次构建生成唯一版本号或 release id，把产物和 sourcemap 一起归档，并在监控平台上以同一 release 维度关联。',
      '这一步非常重要，因为 sourcemap 的可用性高度依赖版本一致性。',
      '面试里如果你能主动讲版本绑定，说明你不是只知道“上传 sourcemap”，而是真的知道怎么让它可用。',
    ],
  },
  {
    title: '4. 安全层面要考虑访问控制、存储时长和清理策略',
    paragraphs: [
      '即使 sourcemap 不公开，也不意味着可以无限制地放着。企业实践里通常还要考虑：哪些环境生成 sourcemap、谁能访问、保存多久、历史版本是否清理、是否分级保存敏感项目的 map。',
      '例如生产环境可以生成并上传，但不在公网目录暴露；过期版本按策略归档或删除；只允许监控平台和内部运维调试链路读取。',
      '这些策略能把“调试便利”和“源码暴露风险”平衡得更好。',
    ],
  },
  {
    title: '5. 面试里怎样把这题答稳',
    paragraphs: [
      '先讲 sourcemap 的价值和风险是一对矛盾；再说明生产环境通常会生成 sourcemap 但不公开暴露，而是上传到监控平台或受控存储；然后强调和版本绑定；最后补访问控制、保存时长和清理策略。',
      '一句话收尾可以这样说：线上 sourcemap 最佳实践不是“不开”，也不是“裸放公网”，而是“受控生成、受控存储、按版本解析”。',
    ],
  },
];

export default function EngineeringInterviewSourcemapManagementPage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Engineering Interview"
      company="面试-工程化 / 性能 / 发布类"
      issue="Issue 05"
      title="线上 sourcemap 应该如何管理，既方便排错又兼顾安全"
      strapline="正确答案通常不是开或不开，而是“生成但受控使用”。"
      abstract="这道题真正考的是工程治理意识。高分回答应该把调试效率、版本一致性和源码暴露风险一起考虑，而不是简单站队。"
      leadTitle="把 sourcemap 管理讲成一套发布与调试治理方案"
      lead="如果只说“生产不要开 sourcemap”，答案会很粗糙；如果只说“开了方便查错”，又忽略安全风险。更完整的回答，是讲如何让它在内部可用，但不对外裸露。"
      answerOutline={[
        '先讲 sourcemap 的价值和风险',
        '再讲生产环境常见的受控生成与上传方案',
        '然后讲版本绑定和解析准确性',
        '最后补访问控制、归档和清理策略',
      ]}
      quickAnswer="一句话答法：线上 sourcemap 最稳的管理方式通常是构建时生成，但不对公网直接暴露，而是上传到 Sentry 等监控平台或内部受控存储，并与每次发布版本严格绑定。这样既能在报错时把堆栈还原到源码，又能避免普通用户直接拿到 sourcemap 文件。同时还要配套访问控制、保留时长和清理策略。"
      pullQuote="最理想的 sourcemap 管理，不是“完全没有”，而是“只有该看的人看得到”。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先讲“调试便利 vs 源码暴露”这对矛盾，结构会很好。',
        '一定提 release/version 绑定，这是可用性的关键。',
        '不要忘了补访问控制和清理策略，这会更像真实治理方案。',
      ]}
      mistakes={[
        '直接回答“生产不开 sourcemap”，忽略排错需要。',
        '只说上传监控平台，不讲版本绑定。',
        '忽略公网暴露和历史文件清理风险。',
      ]}
      singleColumn
    />
  );
}
