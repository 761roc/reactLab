import {
  InterviewEditorialPage,
  type EditorialFact,
  type EditorialSection,
} from '../../common/ui/InterviewEditorialPage';

const facts: EditorialFact[] = [
  { label: '原型链', value: '对象查找属性时沿着 [[Prototype]] 向上找' },
  { label: '继承本质', value: '让对象或构造函数原型链发生关联' },
  { label: 'class', value: '更现代的语法糖，本质仍建立在原型机制上' },
  { label: '答题重点', value: '把语法和底层原型模型对齐' },
];

const sections: EditorialSection[] = [
  {
    title: '1. 原型链的本质，是对象找不到属性时沿着原型继续查找',
    paragraphs: [
      'JavaScript 对象访问属性时，先看对象自己有没有；如果没有，就沿着它的内部原型引用，也就是 `[[Prototype]]`，继续向上找，直到找到或走到 null 为止。这条向上查找路径就是原型链。',
      '所以原型链并不是一个单独存在的结构，而是属性查找规则背后的路径。',
      '回答这道题时，最好先把原型链还原成“属性查找机制”，而不是先背一堆名词。',
    ],
  },
  {
    title: '2. 原型和构造函数的关系，要区分“函数身上的 prototype”和“实例的原型”',
    paragraphs: [
      '这是一个很容易混淆的点。构造函数 `Foo` 身上有一个 `prototype` 属性，这个对象通常用来放实例共享的方法；而实例对象 `foo` 本身会通过内部原型指向 `Foo.prototype`。',
      '也就是说，函数的 `prototype` 是给实例准备的共享方法容器，实例的 `[[Prototype]]` 则决定属性查找往哪走。',
      '只要把这两个东西分开，原型相关问题会清楚很多。',
    ],
  },
  {
    title: '3. 继承的本质，是让一个对象或一个类型复用另一个原型链上的能力',
    paragraphs: [
      '无论是传统构造函数继承，还是 `class extends`，它们底层都离不开原型链关联。所谓继承，并不是复制一份父类代码，而是让子对象或子类实例在找属性时，能继续沿着父级原型去查找。',
      '因此继承本质上仍是原型链复用，而不是传统类语言里那种完全不同的对象模型。',
      '这也是为什么 JavaScript 里谈继承时，最终都要回到原型链。',
    ],
  },
  {
    title: '4. class 更像一层语法糖，它让写法更像传统类，但本质没变',
    paragraphs: [
      '`class` 的最大价值是让构造函数、原型方法、继承语法、super 调用变得更接近主流面向对象语言，从而更易读、更规范。',
      '但底层上，实例方法依然挂在 prototype 上，继承依然通过原型链建立，实例查找属性时也仍然沿着原型链工作。',
      '所以面试里最稳的一句话是：class 不是新对象模型，而是对原型机制的现代语法封装。',
    ],
  },
  {
    title: '5. 面试里怎样把三者关系讲完整',
    paragraphs: [
      '先讲原型链是属性查找路径；再区分函数的 prototype 和实例的原型；然后说明继承本质上是在建立原型链复用；最后补充 class 只是更好写的语法糖。',
      '一句话收尾可以这样说：原型链是底层机制，继承是建立这种复用关系的方式，class 则是对这套机制的语法层包装。',
    ],
  },
];

export default function BrowserJsInterviewPrototypePage() {
  return (
    <InterviewEditorialPage
      archiveLabel="Browser / Async / JS Interview"
      company="面试-浏览器 / 异步 / JS 基础类"
      issue="Issue 04"
      title="原型链、继承、class 本质上是什么关系"
      strapline="别把 class 当新模型，它只是让原型机制看起来更像传统类。"
      abstract="这道题真正考的是你能否把 JavaScript 语法层写法还原到底层对象模型，而不是只会背 prototype 和 class 关键字。"
      leadTitle="从属性查找机制出发，把原型链、继承和 class 对齐"
      lead="最稳的主线是：先讲原型链是属性查找路径，再讲继承是在建立这种复用关系，最后说明 class 只是更现代的语法封装。"
      answerOutline={[
        '先讲原型链是属性查找路径',
        '再区分 prototype 与实例原型',
        '然后讲继承本质是原型链复用',
        '最后讲 class 是语法糖而不是新模型',
      ]}
      quickAnswer="一句话答法：原型链是 JavaScript 对象查找属性时沿着内部原型不断向上查找的路径；继承本质上是在建立这种原型链复用关系；而 `class` 只是让构造函数、原型方法和继承语法更现代易读的一层语法糖，底层仍然建立在原型机制上。"
      pullQuote="原型链是底层规则，继承是复用关系，class 只是更好写。"
      facts={facts}
      sections={sections}
      interviewTips={[
        '先把原型链讲成属性查找机制，而不是抽象名词。',
        '一定区分函数的 prototype 和实例的原型。',
        '最后补一句“class 不是新模型”，很关键。',
      ]}
      mistakes={[
        '把 prototype 和 [[Prototype]] 混为一谈。',
        '把 class 讲成完全不同于原型的新机制。',
        '不会把继承还原回原型链关联。',
      ]}
      singleColumn
    />
  );
}
