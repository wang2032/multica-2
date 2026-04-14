// Mock course data
const coursesData = [
    {
        id: 1,
        title: "Python 基础入门",
        instructor: "李老师",
        category: "编程开发",
        description: "Python 是一门简单易学且功能强大的编程语言。本课程将带您从零开始，掌握 Python 的基本语法和常用库，为后续的编程之路打下坚实基础。",
        cover: null,
        targetAudience: ["零基础编程学习者", "对数据分析感兴趣的同学", "希望提升办公效率的职场人士"],
        sections: [
            { title: "第一章：Python 简介与环境搭建", description: "了解 Python 的发展历史和应用领域，安装 Python 运行环境" },
            { title: "第二章：变量与数据类型", description: "学习 Python 中的变量声明、基本数据类型以及类型转换" },
            { title: "第三章：条件语句与循环", description: "掌握 if-else 条件语句和 for、while 循环的使用" },
            { title: "第四章：函数与模块", description: "学习如何定义函数、使用内置模块和创建自定义模块" }
        ]
    },
    {
        id: 2,
        title: "Web 前端开发实战",
        instructor: "王老师",
        category: "编程开发",
        description: "从 HTML、CSS 到 JavaScript，全面掌握 Web 前端开发技术。通过多个实战项目，学会构建美观、交互性强的现代网页。",
        cover: null,
        targetAudience: ["想要入门 Web 开发的初学者", "有基础但缺乏实战经验的前端学习者", "希望转行前端的在职人员"],
        sections: [
            { title: "第一章：HTML 基础", description: "HTML 文档结构、常用标签和表单元素" },
            { title: "第二章：CSS 样式设计", description: "CSS 选择器、盒模型、Flexbox 和 Grid 布局" },
            { title: "第三章：JavaScript 入门", description: "JavaScript 基础语法、DOM 操作和事件处理" },
            { title: "第四章：综合项目实战", description: "完成一个完整的个人博客页面开发" }
        ]
    },
    {
        id: 3,
        title: "数据分析与可视化",
        instructor: "张老师",
        category: "数据科学",
        description: "学习使用 Python 进行数据处理、分析和可视化。掌握 pandas、numpy、matplotlib 等工具，从数据中挖掘有价值的信息。",
        cover: null,
        targetAudience: ["对数据分析感兴趣的学员", "需要处理数据的职场人士", "希望从事数据相关工作的求职者"],
        sections: [
            { title: "第一章：数据分析概述", description: "数据分析的基本流程和常用方法介绍" },
            { title: "第二章：pandas 数据处理", description: "使用 pandas 进行数据读取、清洗和转换" },
            { title: "第三章：数据可视化", description: "使用 matplotlib 和 seaborn 创建各种图表" },
            { title: "第四章：实战案例分析", description: "通过真实数据集完成完整的数据分析项目" }
        ]
    },
    {
        id: 4,
        title: "产品经理入门指南",
        instructor: "刘老师",
        category: "产品运营",
        description: "了解产品经理的职责和工作流程，学习需求分析、产品设计、项目管理等核心技能，为进入产品领域做好准备。",
        cover: null,
        targetAudience: ["想要从事产品经理工作的学员", "创业者和管理层", "对产品工作感兴趣的任何人"],
        sections: [
            { title: "第一章：产品经理概述", description: "产品经理的角色定位和能力模型" },
            { title: "第二章：需求分析方法", description: "用户调研、需求收集和分析技术" },
            { title: "第三章：产品设计流程", description: "从概念到原型的产品设计方法" },
            { title: "第四章：项目管理和团队协作", description: "敏捷开发流程和跨部门协作技巧" }
        ]
    },
    {
        id: 5,
        title: "UI/UX 设计基础",
        instructor: "陈老师",
        category: "设计创意",
        description: "学习用户界面和用户体验设计的基本原则，掌握 Figma 等设计工具，创建美观且易用的数字产品。",
        cover: null,
        targetAudience: ["对 UI/UX 设计感兴趣的初学者", "希望提升设计能力的开发者", "想要转行设计的职场人士"],
        sections: [
            { title: "第一章：设计基础理论", description: "色彩理论、字体选择和布局原则" },
            { title: "第二章：用户研究方法", description: "用户访谈、问卷调查和可用性测试" },
            { title: "第三章：界面设计实践", description: "使用 Figma 进行界面设计和交互原型制作" },
            { title: "第四章：设计规范与组件库", description: "建立设计系统和组件库的方法" }
        ]
    },
    {
        id: 6,
        title: "人工智能导论",
        instructor: "周老师",
        category: "人工智能",
        description: "探索人工智能的基本概念和发展历史，了解机器学习、深度学习的核心原理，为深入学习 AI 技术奠定基础。",
        cover: null,
        targetAudience: ["对 AI 技术感兴趣的学员", "希望了解 AI 应用的管理者", "计划学习机器学习的初学者"],
        sections: [
            { title: "第一章：人工智能概述", description: "AI 的定义、发展历程和应用领域" },
            { title: "第二章：机器学习基础", description: "监督学习、无监督学习和强化学习概念" },
            { title: "第三章：深度学习入门", description: "神经网络原理和常用深度学习模型" },
            { title: "第四章：AI 伦理与社会影响", description: "AI 伦理问题和未来发展趋势讨论" }
        ]
    }
];