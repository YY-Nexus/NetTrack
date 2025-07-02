import gradio as gr
import torch
import requests
from PIL import Image
from torchvision import transforms
import json

# 下载 ImageNet 类别标签
def load_imagenet_labels():
    """加载 ImageNet 类别标签"""
    try:
        response = requests.get("https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt")
        labels = response.text.strip().split('\n')
        return labels
    except:
        # 备用标签列表（部分常见类别）
        return [
            "tench", "goldfish", "great white shark", "tiger shark", "hammerhead",
            "electric ray", "stingray", "cock", "hen", "ostrich", "brambling",
            "goldfinch", "house finch", "junco", "indigo bunting", "robin",
            "bulbul", "jay", "magpie", "chickadee", "water ouzel", "kite",
            "bald eagle", "vulture", "great grey owl", "European fire salamander",
            "common newt", "eft", "spotted salamander", "axolotl", "bullfrog",
            "tree frog", "tailed frog", "loggerhead", "leatherback turtle",
            "mud turtle", "terrapin", "box turtle", "banded gecko", "common iguana",
            "American chameleon", "whiptail", "agama", "frilled lizard",
            "alligator lizard", "Gila monster", "green lizard", "African chameleon",
            "Komodo dragon", "African crocodile", "American alligator", "triceratops"
        ]

# 加载预训练模型
def load_model():
    """加载预训练的 ResNet-18 模型"""
    try:
        model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet18', pretrained=True)
        model.eval()
        return model
    except Exception as e:
        print(f"模型加载失败: {e}")
        return None

# 初始化模型和标签
print("🔄 正在加载 PyTorch 图像分类模型...")
model = load_model()
labels = load_imagenet_labels()
print(f"✅ 模型加载完成，支持 {len(labels)} 个类别")

def predict_image(image):
    """
    图像分类预测函数
    
    Args:
        image: PIL Image 对象
        
    Returns:
        dict: 包含类别和置信度的字典
    """
    if model is None:
        return {"错误": 1.0, "模型未加载": 0.0}
    
    if image is None:
        return {"错误": 1.0, "请上传图像": 0.0}
    
    try:
        # 图像预处理
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225]),
        ])
        
        # 转换图像
        input_tensor = preprocess(image)
        input_batch = input_tensor.unsqueeze(0)  # 添加批次维度
        
        # 模型推理
        with torch.no_grad():
            output = model(input_batch)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
        # 获取前10个预测结果
        top_prob, top_indices = torch.topk(probabilities, 10)
        
        # 构建结果字典
        confidences = {}
        for i in range(len(top_indices)):
            idx = top_indices[i].item()
            prob = top_prob[i].item()
            if idx < len(labels):
                label = labels[idx]
                # 美化标签名称
                label = label.replace('_', ' ').title()
                confidences[label] = prob
        
        return confidences
        
    except Exception as e:
        return {"处理错误": 1.0, f"错误信息: {str(e)}": 0.0}

def create_image_classification_demo():
    """创建图像分类演示界面"""
    
    # 创建示例图像（使用占位符）
    examples = [
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",  # 猫
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",   # 狗
        "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=300&h=300&fit=crop",   # 鸟
    ]
    
    # 创建 Gradio 界面
    demo = gr.Interface(
        fn=predict_image,
        inputs=gr.Image(type="pil", label="上传图像进行分类"),
        outputs=gr.Label(num_top_classes=5, label="分类结果"),
        title="🖼️ PyTorch 图像分类演示",
        description="""
        ## 基于 ResNet-18 的图像分类
        
        这个演示使用预训练的 ResNet-18 模型对图像进行分类。
        
        **功能特点：**
        - 支持 1000+ 个 ImageNet 类别
        - 实时图像分类
        - 显示前5个预测结果及置信度
        - 支持常见图像格式 (JPG, PNG, etc.)
        
        **使用方法：**
        1. 上传或拖拽图像到输入区域
        2. 点击"提交"按钮进行分类
        3. 查看分类结果和置信度分数
        
        **技术栈：** PyTorch + ResNet-18 + Gradio
        """,
        examples=examples,
        cache_examples=False,
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            font-family: 'Arial', sans-serif;
        }
        .output-label {
            font-size: 16px;
        }
        """
    )
    
    return demo

# 创建并启动演示
if __name__ == "__main__":
    print("🚀 启动 PyTorch 图像分类演示...")
    demo = create_image_classification_demo()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True,
        quiet=False
    )
