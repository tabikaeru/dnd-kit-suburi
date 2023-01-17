import Link from 'next/link'

const Page = () => {
  const pageList = ['sort']
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {pageList.map((listItem) => (
        <Link key={listItem} href={`/${pageList}`}>
          {listItem}
        </Link>
      ))}
    </div>
  )
}

export default Page
