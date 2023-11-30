export const PageBody = ({ chunk }) => {
  return (
    <div className="col is-offset-1-desktop is-12-touch print-content page-content-body">
      <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
    </div>
  )
}
