import { QuartzComponent } from "./types"
import { joinSegments, pathToRoot, simplifySlug, slugTag } from "../util/path"

export const StudyTags: QuartzComponent = (props) => {
  const tags = [...new Set(props.allFiles.flatMap((file) => file.frontmatter?.tags ?? []))].sort()
  return (
    <section class="study-tags" aria-label="标签导航">
      <h3>标签</h3>
      <div class="tag-cloud">
        {tags.map((tag) => (
          <a
            class="tag-link"
            href={joinSegments(pathToRoot(props.fileData.slug!), "tags", slugTag(tag))}
          >
            #{tag}
          </a>
        ))}
      </div>
      <a class="all-tags" href={joinSegments(pathToRoot(props.fileData.slug!), "tags/")}>
        全部标签 <span aria-hidden="true">→</span>
      </a>
    </section>
  )
}

/** Plain article links; layout and navigation use native Quartz components. */
export const StudyArticleList: QuartzComponent = (props) => {
  const kind = props.fileData.frontmatter?.kind
  if (kind !== "home" && kind !== "collection") return null
  const section = props.fileData.frontmatter?.section
  const posts = props.allFiles
    .filter(
      (file) =>
        file.frontmatter?.kind === "article" &&
        (kind === "home" ||
          file.frontmatter?.section === section ||
          (section === "notes" && file.slug?.startsWith("notes/"))),
    )
    .sort((a, b) => Number(b.dates?.modified ?? 0) - Number(a.dates?.modified ?? 0))
  if (!posts.length) return kind === "home" ? null : <p class="collection-empty">暂无公开笔记。</p>
  return (
    <section class="article-list">
      <h2>{kind === "home" ? "最近更新" : "笔记列表"}</h2>
      <ul>
        {posts.slice(0, kind === "home" ? 8 : undefined).map((file) => (
          <li>
            <a
              class="internal"
              href={joinSegments(pathToRoot(props.fileData.slug!), simplifySlug(file.slug!))}
            >
              {file.frontmatter?.title}
            </a>
            {file.frontmatter?.tags?.length ? (
              <span class="list-tags">
                {file.frontmatter.tags.map((tag) => (
                  <a
                    class="tag-link"
                    href={joinSegments(pathToRoot(props.fileData.slug!), "tags", slugTag(tag))}
                  >
                    #{tag}
                  </a>
                ))}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
