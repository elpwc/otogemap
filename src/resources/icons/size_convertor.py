from PIL import Image
import os

def resize_pixel_art(input_dir='./src/resources/icons'):
    for filename in os.listdir(input_dir):
        if filename.endswith('.png') and not filename.endswith('1000.png'):
            input_path = os.path.join(input_dir, filename)
            
            output_filename = os.path.splitext(filename)[0] + '1000.png'
            output_path = os.path.join(input_dir, output_filename)
            
            with Image.open(input_path) as img:
                # 使用NEAREST方法调整大小到1000x1000
                # NEAREST确保像素不会模糊，保持原始像素的清晰边界
                resized_img = img.resize((1000, 1000), Image.NEAREST)
                resized_img.save(output_path)
                print(f'已处理: {filename} -> {output_filename}')

if __name__ == '__main__':
    resize_pixel_art()
