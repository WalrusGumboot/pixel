use std::collections::HashMap;
use clap::Parser;
use image::{open, RgbImage, Rgb};

#[derive(Parser)]
struct Args {
    pixel_w: u32
}

fn main() {
    let args = Args::parse();

    let pixel_w: u32 = args.pixel_w;
    let input = open("logo.png").unwrap().into_rgb8();
    let mut output = RgbImage::new(input.width(), input.height());

    for x in 0..(input.width() / pixel_w) {
        for y in 0..(input.height() / pixel_w) {
            let mut occurences: HashMap<Rgb<u8>, usize> = HashMap::new();
            for src_x in (x * pixel_w)..((x + 1) * pixel_w) {
                for src_y in (y * pixel_w)..((y + 1) * pixel_w) {
                    let colour = *input.get_pixel(src_x, src_y);
                    occurences.entry(colour).and_modify(|occ| *occ += 1).or_insert(1);
                }
            }

            let max_col: Rgb<u8> = occurences.into_iter().max_by(|a, b| a.1.cmp(&b.1)).unwrap().0;
            for out_x in (x * pixel_w)..((x + 1) * pixel_w) {
                for out_y in (y * pixel_w)..((y + 1) * pixel_w) {
                    output.put_pixel(out_x, out_y, max_col);
                }
            }
        }
    }

    output.save("out.png").unwrap();
}
