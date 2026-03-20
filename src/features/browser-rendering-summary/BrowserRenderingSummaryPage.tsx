import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { browserPrinciplesTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Questions', value: '8', detail: '重排、重绘、布局树、强制同步布局和常见性能优化都覆盖。' },
  { label: 'Focus', value: 'Layout Cost', detail: '核心是弄清楚“有没有影响几何信息”和“有没有重新画像素”。' },
  { label: 'Scenarios', value: '卡顿 / 动画 / 大列表', detail: '页面抖动、动画掉帧、滚动卡顿，经常都和这块有关。' },
] as const;

const definitions = [
  { title: '重排就是重新算布局', detail: '元素的尺寸、位置、流式关系变了，浏览器就可能要重新算一遍布局。' },
  { title: '重绘就是重新画外观', detail: '如果只是颜色、阴影这类外观变了，不一定要重新算布局，但还是得重新画。' },
  { title: '重排通常比重绘更贵', detail: '因为它往往会牵连更多节点，后面还可能顺带触发重绘。' },
  { title: '不是所有样式修改都会重排', detail: '像 `color`、`background` 通常偏重绘；像 `width`、`top` 更容易触发布局变化。' },
  { title: '读布局信息也可能触发同步计算', detail: '比如读取 `offsetWidth`，浏览器可能被迫先把前面的修改结算掉。' },
  { title: '动画优化常常是在“尽量别碰 layout”', detail: '这就是为什么 `transform`、`opacity` 经常比 `top`、`left` 更推荐。' },
] as const;

const relations = [
  { title: '改尺寸 / 位置', detail: '更容易引发布局计算，也就是重排。', signal: 'Layout Change' },
  { title: '改颜色 / 阴影', detail: '通常更偏重绘，不一定动布局。', signal: 'Paint Change' },
  { title: '读布局属性', detail: '可能迫使浏览器把前面的样式修改立刻结算。', signal: 'Forced Layout' },
  { title: 'transform / opacity', detail: '很多时候更利于做平滑动画，因为不直接改布局。', signal: 'Compositor Friendly' },
] as const;

const relationCode = `box.style.width = "200px"   // 可能重排 + 重绘
box.style.color = "red"      // 通常重绘
box.style.transform = "translateX(20px)" // 更适合动画

console.log(box.offsetWidth) // 可能触发同步布局计算`;

const basicQuestions = [
  { title: '问题 1：重排和重绘最通俗的区别怎么讲？', answer: '重排像“重新摆家具”，重绘像“家具不动但重新刷漆”。', explanation: '一个重点在位置尺寸关系，一个重点在视觉外观。这个比喻很适合面试时快速讲清。', code: `width / height / margin -> 更容易重排
color / background -> 更偏重绘`, codeTitle: 'Reflow vs Repaint' },
  { title: '问题 2：为什么说重排通常更贵？', answer: '因为它不只是自己变，还可能影响父元素、兄弟元素甚至整片布局，最后通常还要继续重绘。', explanation: '所以性能优化里一般更怕频繁重排，而不是单纯重绘。', code: `改一个元素宽度
-> 兄弟元素位置变
-> 父容器尺寸可能变
-> 页面需要重新布局`, codeTitle: 'Reflow Cost' },
  { title: '问题 3：哪些操作常常会触发重排？', answer: '改尺寸、位置、字体大小、增删可见节点、切换影响布局的样式，都很常见。', explanation: '面试时别只答一个 `width`，最好顺手带几类操作。', code: `element.style.width = "100px"
element.style.display = "none"
parent.appendChild(child)`, codeTitle: 'Reflow Triggers' },
  { title: '问题 4：哪些操作更像只是重绘？', answer: '像改颜色、背景、边框颜色、阴影这类，不改变布局关系时通常更偏重绘。', explanation: '但别答得太绝对，最终还是要看具体实现和属性组合。', code: `element.style.color = "blue"
element.style.backgroundColor = "#111"`, codeTitle: 'Repaint Triggers' },
] as const;

const practicalQuestions = [
  { title: '问题 5：为什么读取 `offsetWidth` 这类属性会有性能风险？', answer: '因为浏览器可能得先把前面所有还没结算的样式更新算完，才能给你一个准确值。', explanation: '这就是常说的“强制同步布局”或“layout thrashing”。', code: `box.style.width = "200px"
console.log(box.offsetWidth)`, codeTitle: 'Forced Layout Example' },
  { title: '问题 6：为什么动画更推荐 `transform` 和 `opacity`？', answer: '因为它们通常不直接改布局，更容易走更轻的渲染路径，掉帧风险更低。', explanation: '这是前端动画优化里非常经典的一条经验。', code: `bad: top / left
better: transform: translateX(...)`, codeTitle: 'Animation Property Choice' },
  { title: '问题 7：如何减少频繁重排？', answer: '批量改样式、避免读写交错、离线修改 DOM、把重动画交给 transform / opacity，都是常见手段。', explanation: '这里重点不是一句“减少 DOM 操作”，而是知道为什么这些办法有效。', code: `// 先读，后批量写
const width = box.offsetWidth
box.style.width = width + 20 + "px"
box.style.height = "40px"`, codeTitle: 'Batch Update Idea' },
  { title: '问题 8：这类题怎么回答得更工程化？', answer: '最好顺手带上“怎么测、怎么查、怎么优化”，比如 Performance 面板、FPS、长任务。', explanation: '这样就不是只会背定义，而是真能排性能问题。', code: `Chrome DevTools
-> Performance
-> 查看 Layout / Paint / Long Task`, codeTitle: 'Performance Tooling' },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问有没有影响位置和尺寸', detail: '有的话优先往重排方向想。' },
  { title: '第二步：再问是不是只是视觉变化', detail: '如果只是外观改动，通常更偏重绘。' },
  { title: '第三步：看有没有读写交错', detail: '一边改样式一边读布局，是强制同步布局的高发点。' },
  { title: '第四步：动画类问题最后补属性选择', detail: '讲到 transform / opacity，回答会更完整。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把所有样式改动都说成重排', detail: '很多属性其实更偏重绘，不是每次都会重新算布局。', points: ['先看属性类型', '别一概而论', '分 layout 和 paint'] },
  { title: '高频误区 2：只知道“重排更贵”，不知道为什么', detail: '真正关键是它可能牵连更多节点，还经常顺带触发后续绘制。', points: ['影响范围更大', '链路更长', '经常连带重绘'] },
  { title: '高频误区 3：忽略读布局信息的成本', detail: '性能题里不只是“写”有问题，“读”也可能让浏览器立刻结算。', points: ['offsetWidth', 'getBoundingClientRect', 'scrollTop 等'] },
  { title: '高频误区 4：动画优化只会说“少操作 DOM”', detail: '更具体的说法通常是：用合适属性、减少 layout、减少同步测量。', points: ['transform', 'opacity', '批量更新'] },
] as const;

const rules = [
  { title: '改布局先想到重排', detail: '尺寸、位置、流式关系变化，是最典型的信号。' },
  { title: '改外观先想到重绘', detail: '颜色、背景、阴影通常更偏这一类。' },
  { title: '读写交错是性能坏味道', detail: '尤其在循环里更容易把页面拖卡。' },
  { title: '动画优先避开 layout 属性', detail: '这条经验在很多项目里都很稳。' },
] as const;

export default function BrowserRenderingSummaryPage() {
  return <KnowledgeSummaryPage eyebrow="Browser Principles / Rendering" title="重排和重绘" lead="这页把浏览器渲染性能里很常见的一块用更接地气的方式讲清楚：什么时候浏览器只是重新画一下，什么时候得重新排版，为什么有些动画会卡，为什么有些属性更适合做动画。" heroCards={heroCards} definitionsTitle="块 1：基础定义（先分清 layout 和 paint）" definitionsNote="用意：先知道两类成本分别在干什么。" definitions={definitions} relationsTitle="块 2：核心关系速览" relationsNote="用意：先把常见样式操作放进正确的渲染视角。" relations={relations} relationCodeTitle="Layout And Paint Example" relationCode={relationCode} questionGroups={[{ title: '块 3：基础机制高频问题', note: '用意：先把重排和重绘的区别与触发条件说清。', label: 'Rendering Basics', questions: basicQuestions }, { title: '块 4：性能实践高频问题', note: '用意：再把动画、测量和优化策略连到真实场景。', label: 'Rendering Performance', questions: practicalQuestions }]} diagnosticTitle="块 5：四步拆题法" diagnosticNote="用意：性能题和渲染题都能按这个顺序拆。" diagnosticSteps={diagnosticSteps} pitfallsTitle="块 6：常见误区" pitfallsNote="用意：把这类题里最容易答模糊的地方挑出来。" pitfalls={pitfalls} rulesTitle="块 7：记忆规则" rulesNote="用意：复盘时快速回忆最稳的判断规则。" rules={rules} overviewTitle="块 8：问题总览" overviewNote="用意：快速回顾这页覆盖的点。" themeStyle={browserPrinciplesTheme} />;
}
