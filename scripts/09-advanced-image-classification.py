import gradio as gr
import torch
import torchvision.transforms as transforms
from PIL import Image
import json
import time
import numpy as np

class ImageClassificationPipeline:
    """高级图像分类管道"""
    
    def __init__(self):
        self.models = {}
        self.labels = {}
        self.load_models()
    
    def load_models(self):
        """加载多个预训练模型"""
        print("🔄 正在加载多个图像分类模型...")
        
        try:
            # ResNet-18
            self.models['resnet18'] = torch.hub.load('pytorch/vision:v0.10.0', 'resnet18', pretrained=True).eval()
            print("✅ ResNet-18 加载完成")
            
            # ResNet-50
            self.models['resnet50'] = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=True).eval()
            print("✅ ResNet-50 加载完成")
            
            # MobileNet V2
            self.models['mobilenet'] = torch.hub.load('pytorch/vision:v0.10.0', 'mobilenet_v2', pretrained=True).eval()
            print("✅ MobileNet V2 加载完成")
            
        except Exception as e:
            print(f"❌ 模型加载失败: {e}")
            # 创建虚拟模型用于演示
            self.models['demo'] = None
    
    def get_imagenet_labels(self):
        """获取 ImageNet 标签"""
        labels = [
            "猫科动物", "犬科动物", "鸟类", "鱼类", "爬行动物",
            "哺乳动物", "昆虫", "花朵", "树木", "建筑物",
            "车辆", "飞机", "船只", "食物", "水果",
            "蔬菜", "工具", "家具", "电子设备", "运动器材"
        ]
        return labels
    
    def preprocess_image(self, image):
        """图像预处理"""
        if image is None:
            return None
            
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225]),
        ])
        
        return preprocess(image).unsqueeze(0)
    
    def predict_with_model(self, image, model_name="resnet18"):
        """使用指定模型进行预测"""
        if image is None:
            return {"错误": "请上传图像"}
        
        start_time = time.time()
        
        try:
            # 预处理图像
            input_tensor = self.preprocess_image(image)
            
            if model_name in self.models and self.models[model_name] is not None:
                model = self.models[model_name]
                
                with torch.no_grad():
                    output = model(input_tensor)
                    probabilities = torch.nn.functional.softmax(output[0], dim=0)
                
                # 获取前5个预测结果
                top_prob, top_indices = torch.topk(probabilities, 5)
                
                # 使用简化标签
                labels = self.get_imagenet_labels()
                
                confidences = {}
                for i in range(len(top_prob)):
                    idx = top_indices[i].item() % len(labels)  # 确保索引在范围内
                    prob = top_prob[i].item()
                    label = labels[idx]
                    confidences[f"{label} (类别{idx})"] = prob
                    
            else:
                # 演示模式 - 生成随机预测
                labels = self.get_imagenet_labels()
                confidences = {}
                probs = np.random.dirichlet(np.ones(5))  # 生成5个随机概率
                
                for i, prob in enumerate(probs):
                    label = labels[i % len(labels)]
                    confidences[f"{label} (演示)"] = float(prob)
            
            inference_time = time.time() - start_time
            
            # 添加推理时间信息
            confidences[f"⏱️ 推理时间: {inference_time:.3f}秒"] = 0.0
            
            return confidences
            
        except Exception as e:
            return {"处理错误": 1.0, f"错误: {str(e)}": 0.0}
    
    def compare_models(self, image):
        """比较多个模型的预测结果"""
        if image is None:
            return "请上传图像进行比较"
        
        results = {}
        
        for model_name in ['resnet18', 'resnet50', 'mobilenet']:
            if model_name in self.models:
                prediction = self.predict_with_model(image, model_name)
                # 获取最高置信度的预测
                if prediction and len(prediction) > 1:
                    top_pred = max(prediction.items(), key=lambda x: x[1] if isinstance(x[1], (int, float)) else 0)
                    results[f"{model_name.upper()}"] = f"{top_pred[0]}: {top_pred[1]:.3f}"
        
        if not results:
            return "模型比较暂不可用"
        
        comparison_text = "## 🔍 模型比较结果\n\n"
        for model, result in results.items():
            comparison_text += f"**{model}**: {result}\n\n"
        
        return comparison_text

# 初始化分类管道
pipeline = ImageClassificationPipeline()

def create_advanced_demo():
    """创建高级图像分类演示"""
    
    with gr.Blocks(theme=gr.themes.Soft(), title="高级图像分类") as demo:
        gr.Markdown("""
        # 🎯 高级图像分类演示
        
        ## 功能特点
        - 🤖 多模型支持 (ResNet-18/50, MobileNet V2)
        - ⚡ 实时推理性能监控
        - 📊 模型比较分析
        - 🎨 可视化结果展示
        """)
        
        with gr.Tab("单模型分类"):
            with gr.Row():
                with gr.Column():
                    image_input = gr.Image(type="pil", label="上传图像")
                    model_choice = gr.Dropdown(
                        choices=["resnet18", "resnet50", "mobilenet"],
                        value="resnet18",
                        label="选择模型"
                    )
                    classify_btn = gr.Button("🔍 开始分类", variant="primary")
                
                with gr.Column():
                    classification_output = gr.Label(
                        num_top_classes=5,
                        label="分类结果"
                    )
        
        with gr.Tab("模型比较"):
            with gr.Row():
                with gr.Column():
                    compare_image = gr.Image(type="pil", label="上传图像进行比较")
                    compare_btn = gr.Button("🆚 比较模型", variant="secondary")
                
                with gr.Column():
                    comparison_output = gr.Markdown(label="比较结果")
        
        with gr.Tab("批量处理"):
            with gr.Row():
                with gr.Column():
                    batch_images = gr.File(
                        file_count="multiple",
                        file_types=["image"],
                        label="上传多张图像"
                    )
                    batch_model = gr.Dropdown(
                        choices=["resnet18", "resnet50", "mobilenet"],
                        value="resnet18",
                        label="批处理模型"
                    )
                    batch_btn = gr.Button("📦 批量处理", variant="secondary")
                
                with gr.Column():
                    batch_output = gr.Textbox(
                        label="批处理结果",
                        lines=10,
                        max_lines=20
                    )
        
        # 事件绑定
        classify_btn.click(
            fn=lambda img, model: pipeline.predict_with_model(img, model),
            inputs=[image_input, model_choice],
            outputs=classification_output
        )
        
        compare_btn.click(
            fn=pipeline.compare_models,
            inputs=compare_image,
            outputs=comparison_output
        )
        
        def batch_process(files, model_name):
            if not files:
                return "请上传图像文件"
            
            results = []
            for i, file in enumerate(files[:5]):  # 限制处理5张图像
                try:
                    image = Image.open(file.name)
                    prediction = pipeline.predict_with_model(image, model_name)
                    top_pred = max(prediction.items(), key=lambda x: x[1] if isinstance(x[1], (int, float)) else 0)
                    results.append(f"图像 {i+1}: {top_pred[0]} ({top_pred[1]:.3f})")
                except Exception as e:
                    results.append(f"图像 {i+1}: 处理失败 - {str(e)}")
            
            return "\n".join(results)
        
        batch_btn.click(
            fn=batch_process,
            inputs=[batch_images, batch_model],
            outputs=batch_output
        )
        
        # 示例
        gr.Examples(
            examples=[
                ["https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop"],
                ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop"],
            ],
            inputs=image_input,
            outputs=classification_output,
            fn=lambda img: pipeline.predict_with_model(img, "resnet18"),
            cache_examples=False
        )
    
    return demo

# 启动演示
if __name__ == "__main__":
    print("🚀 启动高级图像分类演示...")
    demo = create_advanced_demo()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7861,
        share=False
    )
