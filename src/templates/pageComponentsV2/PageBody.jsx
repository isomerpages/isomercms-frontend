export const PageBody = ({ chunk }) => {
  return (
    <div className="col is-8 is-offset-1-desktop is-12-touch print-content page-content-body">
      <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
    </div>
  )
}
