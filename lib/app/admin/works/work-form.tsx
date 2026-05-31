import type { PoetryWork } from "@/lib/types";

export function WorkForm({
  work,
  action,
}: {
  work?: PoetryWork;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="form-panel form-grid">
      <label>
        标题
        <input name="title" defaultValue={work?.title} required />
      </label>
      <label>
        URL 别名
        <input name="slug" defaultValue={work?.slug} placeholder="li-bai-jing-ye-si" required />
      </label>
      <label>
        作者
        <input name="author" defaultValue={work?.author} required />
      </label>
      <label>
        朝代
        <input name="dynasty" defaultValue={work?.dynasty ?? ""} placeholder="唐" />
      </label>
      <label>
        体裁
        <input name="genre" defaultValue={work?.genre ?? ""} placeholder="五言绝句" />
      </label>
      <label>
        标签
        <input name="tags" defaultValue={work?.tags?.join("，") ?? ""} placeholder="思乡，明月" />
      </label>
      <label className="full">
        正文
        <textarea name="content" defaultValue={work?.content} required />
      </label>
      <label className="full">
        注释
        <textarea name="notes" defaultValue={work?.notes ?? ""} />
      </label>
      <label className="full">
        赏析
        <textarea name="appreciation" defaultValue={work?.appreciation ?? ""} />
      </label>
      <div className="checkbox-row full">
        <label>
          <input name="featured" type="checkbox" defaultChecked={work?.featured ?? false} />
          首页精选
        </label>
        <label>
          <input name="published" type="checkbox" defaultChecked={work?.published ?? true} />
          发布
        </label>
      </div>
      <div className="form-actions full">
        <button className="text-button" type="submit">
          保存作品
        </button>
      </div>
    </form>
  );
}
